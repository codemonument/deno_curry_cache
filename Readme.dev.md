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

Deno tasks select the JB profile inline with `DEV_ENV=jb varlock run -- ...`,
so fresh clones no longer need a gitignored `.env.local` selector for normal
local commands. Do not put the selector in `.env.jb`.

On JB macOS machines, `.env.jb` resolves local dev secrets from project/profile
scoped Keychain items via the jb-dev-env `exec(security ...)` fallback:

- service: `varlock`
- account: `deno_curry_cache:jb:<ENV_VAR_NAME>`
- label/comment/metadata when supported: `/Users/bjesuiter/Develop/codemonument/deno_curry_cache`

The committed profile contains resolver references only:

```env
PLANETSCALE_USER=exec("security find-generic-password -s varlock -a \"deno_curry_cache:jb:PLANETSCALE_USER\" -w")
PLANETSCALE_PASSWD=exec("security find-generic-password -s varlock -a \"deno_curry_cache:jb:PLANETSCALE_PASSWD\" -w")
```

If these secrets are recreated, prefer Varlock-native Keychain commands such as
`varlock keychain set PLANETSCALE_USER --project deno_curry_cache --profile jb --write-to .env.jb`.
Do not use one global Keychain item keyed only by env var name.

Run Deno tasks through the configured task wrappers so Varlock resolves and
validates the environment before Deno starts.

## Configure Deployments to deno.land/x 

see https://deno.land/add_module
