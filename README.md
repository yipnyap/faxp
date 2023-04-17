# FurAffinity -> Yipnyap .faxp export tool
This tool exports your FurAffinity submissions into a .faxp file that can be imported into Yipnyap and
other services that support it.

(This is jank, but it works. Whatever, man!)

## .faxp format
The .faxp format is a simple JSON format that contains the following information:
```ts
interface Submission {
    id: number;
    title?: string;
    description?: string;
    date: number; // Unix timestamp in milliseconds. Heavily inaccurate as it's calculated in your timezone from EST, but useful for sorting.
    image: string; // URL to the image hosted on FurAffinity
    tags: string[];
    scrap: boolean;
    rating: 'general' | 'mature' | 'adult' | 'unknown';
}
```

## Still WIP
This is heavily a work in progress, and is nowhere near complete. A lot of the features are still missing, and
the code is a mess.

## Why?
This tool takes inspiration from Lemonynade ([@mvdicarlo](https://github.com/mvdicarlo))'s [FurAffinity Export
Tool](https://github.com/mvdicarlo/furaffinity-export), more specifically the method of scraping the submission
pages and the .faxp format (although modified to be a little cleaner). They run [Postybirb](https://www.postybirb.com/),
a cross-posting tool.

The export tool they made no longer worked at all, and Yipnyap requires some specific information to assist in the
import process, so we made this tool to export the data in a way that Yipnyap can use. Unlike Lemonynade's tool,
which relies on a webview to login, this tool injects itself on top of FurAffinity.

FurAffinity, being FurAffinity, hates you having choice, and does not let you export all your submissions you have.
***You can't export. period***. Until they change their mind, this tool will be useful for those who want to export their
submissions even if you don't intend to use Yipnyap. You may have the tool download all submissions for you and save
on your device.

## Small little disclaimer
**This is probably against FurAffinity's TOS**. While it's vague, and they seem to make it up on the spot, misuse of this
may result in your account being banned. Yipnyap isn't responsible for any account prosecutions that may occur from
using this tool. Use at your own risk.

## Installation
### Building from source
Ensure you have Node.JS & Yarn installed. Then, follow these steps:
1. Clone the repository
2. Run `yarn`
3. Run `yarn build` to build. By default, it will build for whatever your current platform is. If you want to build for
   another platform, run `yarn build -- --target <platform>`. For example, `yarn build -- --target win32` will build for
   Windows. You can find a list of supported platforms [here](https://www.electron.build/configuration/configuration#BuildOptions-target).

### Local development
Ensure you have Node.JS & Yarn installed. Then, follow these steps:
1. Clone the repository
2. Run `yarn`
3. Run `yarn watch:ts` & `yarn watch:webpack` to watch for changes in the source code and recompile.
4. Also run `yarn electron` to start the Electron app, only after the initial builds above have completed and is watching
   for changes.

## Contributing
If you want to contribute, feel free to open a PR. If you want to help out, but don't know where to start, check out
the [issues](/../../issues) page. If you want to help out, but don't know how to code, you can help out by testing the tool
and reporting any bugs you find.

Please also see the [Code of Conduct](/CODE_OF_CONDUCT.md) and [Contributing Guidelines](/CONTRIBUTING.md).
