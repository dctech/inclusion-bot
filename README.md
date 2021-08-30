# Inclusion Bot

The Inclusion Bot is a Slack App which passively listens for language with racist, ableist, sexist, or other exclusionary histories. When it hears such words or phrases, it quietly lets the speaker know and offers some suggestions — helping nudge us all to thoughtful, inclusive language.

<a href="https://slack.com/oauth/v2/authorize?client_id=2429423712965.2439245039812&scope=channels:history,chat:write,chat:write.customize,reactions:write,reactions:read&user_scope="><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack@2x.png"></a>

Many thanks to [18F’s Charlie](https://github.com/18F/charlie), from which this bot was extracted and adapted.

## Development

This is a TypeScript application run locally with Docker. To see available tasks, run:

```sh
make
```

You may also find it useful to install node.js locally (see [package.json’s engines property](./package.json) for the current version) and install dependencies with `yarn install` — this will enable intelligent TypeScript code suggestions in your editor of choice. If you don’t yet have `yarn` installed, install it with `npm install yarn --global`.

## Deployment

This application is deployed automatically with [Heroku pipelines](https://devcenter.heroku.com/articles/pipelines) — the `main` branch is automatically deployed to a bot in the [Inclusion Bot Test Slack](https://inclusion-bot.slack.com/).
