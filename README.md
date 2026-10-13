# convai-widget

A voice agent for my portfolio at [adcd.nyc](https://www.adcd.nyc). Visitors talk to it about my work, and it can act on the page while it talks: when someone asks about a project, the agent calls a tool that puts that case study's link on screen, then confirms it out loud.

**Live:** [adcd.nyc](https://www.adcd.nyc) · [standalone demo](https://thomasjsx.github.io/convai-widget/index_20.html)

## How it works

The agent lives in two places:

| Where | What |
|---|---|
| **ElevenLabs** (Conversational AI) | System prompt and rules, a knowledge base the agent retrieves from (RAG over my portfolio and case studies), and the tool definitions |
| **This repo** (the page) | A custom voice UI built on the `@elevenlabs/client` Conversation SDK, plus the client-side tools the agent can call |

### Client-side tool calling

The page registers a `show_case_study` tool with the conversation session:

```js
clientTools: {
  show_case_study: async ({ slug }) => {
    const cs = CASE_STUDIES[(slug || '').toLowerCase().trim()];
    if (!cs) return 'No case study found for that project. Available: portfolio, thia, stitches.';
    // render the link under the orb
    return `A link to the ${cs.title} case study is now showing below the orb.`;
  }
}
```

1. A visitor asks something like "what's Stitches?"
2. The agent answers from its knowledge base and decides to call `show_case_study({ slug: "stitches" })`.
3. The page renders the case study link and returns a result string.
4. The agent reads the result and tells the visitor the link is on screen.

An unknown slug returns the list of valid options, so the agent can recover instead of failing silently.

## Version history

The numbered files are kept on purpose. They show how the build evolved:

| Files | Stage |
|---|---|
| `index.html`–`index_07.html` | ElevenLabs' stock embed widget |
| `index_08.html`–`index_16.html` | Custom UI on the Conversation SDK: my own orb, connection states, and live transcript handling |
| `index_17.html`–`index_20.html` | Client-side tool calling (`show_case_study`) |

## Run it locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/index_20.html` and click the orb. You'll need to allow microphone access.

## Built with

ElevenLabs Conversational AI · `@elevenlabs/client` SDK · RAG knowledge base · client-side tools · vanilla HTML and JS · built with Claude
