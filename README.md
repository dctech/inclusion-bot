# Inclusion Bot

The Inclusion Bot is a Slack App which passively listens for [language with racist, ableist, sexist, or other exclusionary histories](./bot/triggers/triggers.yml). When it hears such words or phrases, it quietly lets the speaker know and offers some suggestions. Inclusive culture is built one interaction at a time, and inclusive language is the foundation — this bot helps us practice our inclusive values in Slack.

<a href="https://inclusion-bot.dunkman.me/install"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack@2x.png"></a>

<img alt="Preview of the bot replying to a message containing the word guys." height="286" width="676" style="max-width: 100%;" src="https://user-images.githubusercontent.com/14930/132792239-72c9aa49-504e-4be7-87e0-c93764e49b24.png">


Many thanks to [18F’s Charlie](https://github.com/18F/charlie), from which this bot was extracted and adapted.

## Development

This is a TypeScript application run locally with Docker. To see available tasks, run:

```sh
make
```

You may also find it useful to install node.js locally (see [package.json’s engines property](./package.json) for the current version) and install dependencies with `yarn install` — this will enable intelligent TypeScript code suggestions in your editor of choice. If you don’t yet have `yarn` installed, install it with `npm install yarn --global`.

## Deployment

This application is deployed automatically with [Heroku pipelines](https://devcenter.heroku.com/articles/pipelines) — the `main` branch is automatically deployed to a bot in the [Inclusion Bot Test Slack](https://inclusion-bot.slack.com/).
