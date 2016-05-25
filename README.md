# Trello Board to Markdown


## Contents

* [Background](#background)
* [Installation](#installation)
* [Configuration](#configuration)
* [Usage](#usage)
* [Contributors](#contributors)
* [Contributing & Bug Reports](#contributing--bug-reports)


## Background

This simple library converts a Trello board to a markdown document. Consider it as a nicer "print" or "export" option.


## Installation

Install via NPM:

```
npm install -g trello-board-to-markdown
```


## Configuration

You'll need to export a few environment vars for the tool to authenticate with Trello:

```
export TRELLO_API_KEY=?
export TRELLO_API_SECRET=?
```

You can get these on the `app-keys` page [on Trello](https://trello.com/app-key).


## Usage

To convert a board to Markdown in the current directory:

```
trellotomd convert BOARD_ID
```

For more information on the supported commands, run `trellotomd --help`.


## Contributors

- [Josh Nesbitt](https://github.com/joshnesbitt)


## Contributing & Bug Reports

Please see the [CONTRIBUTING.md](CONTRIBUTING.md).
