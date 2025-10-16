# Multi Writer Minimal

An example using Autobase + HyperDB + Blind Pairing of Holepunch Stack
- Autobase is for multi writers
- HyperDB is a P2P database
- Blind Pairing is for sharing invites to writers to join the same multi writer room

## Usage

```shell
cd minimal
npm i
npx multi-writer -h

# create a new room, and print invite
npx multi-writer -s tmp/writer1

# join an room with invite
npx multi-writer -s tmp/writer2 -i <invite>
```

## Update DB

- Update `schema.js` then run `npm run db:gen` to generate/update the `spec` dir

- If changing `NAMESPACE` in `schema.js`, better to remove the `spec` dir and its storage dir, then run `npm run db:gen` to generate a fresh `spec` dir

## Run as Pear app

Run this and get the Pear app link
```shell
cd minimal
npm i
pear stage dev
pear seed dev
```

Open another terminal, run the Pear app link
```shell
# create a new room, and print the invite
pear run pear://<app-link> -s tmp/writer1

# join an room using an invite
pear run pear://<app-link> -s tmp/writer2 -i <invite>
```
