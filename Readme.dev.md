# Deno Module Template

A template repo for developing modules with deno. 

## CAUTION!

- DO NOT use import_map.json imports for actual library code! (That is, code that is exported from `mod.ts`)  
  Reason: Once it's consumed by another programmer off of, for example, deno.land/x, the import_map.json file of the imported module 
  WILL NOT BE LOADED!
- However, you CAN use import_map.json import in tests or example code, which i find very useful, because it enables me to simply 
  pull in my testing dependencies with a concise, absolut import. 
- Your test code should import all of your classes and functions from the mod.ts entrypoint. 
  This ensures that you only test the API Surface of your module and not implementation details. 
  If you absolutely need to validate some internal functionality, do it, but know what you do! 


## Folder Structure

- `.vscode` = A folder, 
  - containing a `settings.json` which activates the deno language server for this workspace
  - containing a `extensions.json` with recommended vscode extensions for this workspace
- `example` = A folder, containing entry deno files for demonstrating the modules functionalities 
   - contains `main.ts` - the default file for examples
- `importMap.json` = A file, including dependency mappings to url
- `deps` - a folder to re-export dependencies 
   (for example to group testing dependencies into one import)
- `lib` = A folder containing more source files which are exported by `mod.ts`
   - Hint: you may create multiple of them to structure your module.
- `.gitignore` = A normal gitingore file
- `deno.jsonc` - a config file for the deno cli
   - includes tasks (a.k.a aliases for long commands) with `deno task`
- `LICENSE`
- `mod.ts` = the entrypoint for this deno module, which exports all functionality of this module
- `Readme.md` = A normal Readme file

## Running examples 

see `tasks` property in `deno.jsonc`
Run each key there with `deno task <task-key>`

## Environment

Environment configuration is documented in the committed `.env.schema`. The
committed `.env.jb` file contains resolver references only, not plaintext
secrets. Real local env files stay gitignored.

For optional PlanetScale integration tests, provide `PLANETSCALE_HOST`,
`PLANETSCALE_USER`, and `PLANETSCALE_PASSWD` locally. Keep production and CI
using platform secrets with those same env var names.

Select the JB profile on each machine with a gitignored `.env.local` file:

```env
DEV_ENV=jb
```

Do not put the selector in `.env.jb`; `.env.local` is the machine-local profile
selector.

On JB macOS machines, `.env.jb` resolves local dev secrets from project/profile
scoped Keychain items via the jb-dev-env `exec(security ...)` fallback:

- service: `varlock`
- account: `deno_curry_cache:jb:<ENV_VAR_NAME>`
- label/comment/metadata when supported: `/Users/bjesuiter/Develop/codemonument/deno_curry_cache`

Varlock's current `keychain()` resolver supports explicit `service` and
`account` arguments, but it could not read the currently seeded Keychain items
for this repo. The committed profile therefore uses `exec("security
find-generic-password ... -w")` as a temporary fallback. This bypasses
VarlockEnclave, so prefer migrating back to Varlock-native `keychain(...)` after
creating compatible items with `keychain(prompt)`.

Varlock does not expose a documented argument for writing Keychain label/comment
metadata, so the project scope must be encoded in the account identifier itself.
The exported environment variable name remains the plain variable name.

It also does not expose a documented argument for customizing the
`keychain(prompt)` picker heading/title. Current prompt mode passes only the env
var key to the picker, so headings can remain ambiguous, such as
`Select Keychain Item for PLANETSCALE_USER`. If upstream Varlock/Warlock adds a
custom prompt/title API, use a title like
`Select Keychain Item for PLANETSCALE_USER in deno_curry_cache` and supporting
text containing `/Users/bjesuiter/Develop/codemonument/deno_curry_cache` and
`local dev`.

Use an ignored local env file such as `.env.local` with explicit resolver
references:

```env
DEV_ENV=jb
```

The committed `.env.jb` profile contains:

```env
PLANETSCALE_USER=exec("security find-generic-password -s varlock -a \"deno_curry_cache:jb:PLANETSCALE_USER\" -w")
PLANETSCALE_PASSWD=exec("security find-generic-password -s varlock -a \"deno_curry_cache:jb:PLANETSCALE_PASSWD\" -w")
```

If you use `keychain(prompt)` to create or select the items first, do not rely
on its heading/title for provenance. Selectable item labels, service, and
account must still make provenance clear: variable name, project slug
`deno_curry_cache`, profile `jb`, absolute repo path
`/Users/bjesuiter/Develop/codemonument/deno_curry_cache`, and that this is a
local dev secret. Do not use one global Keychain item keyed only by env var
name.

Run Deno tasks through the configured task wrappers so Varlock resolves and
validates the environment before Deno starts.

## Configure Deployments to deno.land/x 

see https://deno.land/add_module
