# Hello world javascript action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs
<!--TWITTER_STATS_START-->
## This is twitter stats
<!--TWITTER_STATS_END-->

### `time`

The time we greeted you.

## Example usage

uses: actions/hello-world-javascript-action@v1
with:
who-to-greet: 'Mona the Octocat'

