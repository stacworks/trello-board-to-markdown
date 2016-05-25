import logger from '../util/logger';
import NodeTrello from 'node-trello';
import filesystem from 'fs';

const trello = new NodeTrello(
  process.env.TRELLO_API_KEY,
  process.env.TRELLO_API_SECRET
);

function fetchBoardData(id, callback){
  const params = [
    'actions=all',
    'actions_limit=1000',
    'cards=all',
    'lists=all',
    'members=all',
    'member_fields=all',
    'checklists=all',
    'fields=all'
  ];

  trello.get(`/1/boards/${id}?${params.join('&')}`, function(error, board) {
    if (error)
      throw error;

    callback(board);
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
