import logger from '../util/logger';
import NodeTrello from 'node-trello';
import filesystem from 'fs';

const trello = new NodeTrello(
  process.env.TRELLO_API_KEY,
  process.env.TRELLO_API_SECRET
);

function fetchBoardData(id, callback){
  trello.get(`/1/boards/${id}`, function(error, board) {
    if (error)
      throw error;

    trello.get(`/1/boards/${id}/cards`, function(error, cards) {
      if (error)
        throw error;

      board.cards = cards;

      trello.get(`/1/boards/${id}/lists`, function(error, lists) {
        if (error)
          throw error;

        board.lists = lists;

        callback(board);
      });
    });
  });
};

function filterByOpen(collection){
  return collection.filter((object) => {
    return object['closed'] === false;
  });
}

function filterAndSortCards(cards, listID){
  return cards.
    filter((c) => {
      return c['idList'] === listID
    }).
    sort((a, b) => {
      return a['pos'] > b['pos'] ? 1 : -1
    });
}

export function call(options) {
  fetchBoardData(options.id, (board) => {
    const lists = filterByOpen(board['lists']);
    const cards = filterByOpen(board['cards']);
    const markdown = [ `# ${board['name']}` ];

    lists.forEach((list) => {
      markdown.push(`## ${list['name']}`)

      let filtered = filterAndSortCards(cards, list['id']);
      let bullets = [];

      filtered.forEach((card) => {
        bullets.push(`* ${card['name']}`);
      });

      markdown.push(`${bullets.join("\n\n")}\n`);
    });

    const filename = options.filename || `${board['name']}.md`;
    const path = `${process.cwd()}/${filename}`;
    const contents = markdown.join("\n\n");

    filesystem.writeFileSync(path, contents);

    logger.success(`Written file to ${path}`);
  });
}
