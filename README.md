# KnexJS doesn't handle errors properly when transactions are misued. Affects PostgreSQL

## Scenario

1. Tx1 Starts
2. Tx2 Starts under Tx1
3. Tx3 Starts under Tx1
4. Tx2 Commits
5. Tx3 Commits - Fails because Tx2 surrounded Tx3 - outer catch around Tx3 fires even though that promise should be done with.
6. Inner thenables continue to fire as-if Tx3 commit didn't throw an error

## Testing It Yourself

1. set configuration in `src/knex.ts`
2. look over `src/test.ts`
3. run it: `npm install; npm start`

## Output

```
Transaction[1] Started
Transaction[2] Started
Transaction[3] Started
Transaction[2] Committing
Transaction[2] Committed
Transaction[3] Committing
Transaction[3] Could not be started
runBrokenParallelTransactions: Rejecting with  Error: Transaction query already complete ...
Transaction[3] Committed
runBrokenParallelTransactions: Promise has already been resolved/rejected. X2
runBrokenParallelTransactions: Resolving with  [ Result { ... } ]
Transaction[1] Success Error: Transaction query already complete ...
```