import * as pg from 'pg';
import * as Knex from 'knex';
import { knex } from './knex';

export function runTest() {

    knex.transaction(trx => {
        console.log("Transaction[1] Started");
        return runBrokenParallelTransactions(trx)
            .then(a => {
                return a;
            });
    })
    .then(z => {
        console.log("Transaction[1] Success", z);
    })
    .catch(err => {
        console.error("Transaction[1] Error", err)
    })
    .then(() => process.exit(127));


    function runBrokenParallelTransactions(trx: Knex.Transaction): Promise<any> {
        let results: any[] = [];

        return new Promise((resolve, reject) => {
            let resolveRejectCount = 0;
            function resolveWrapper(v:any) {
                resolveRejectCount++;
                if (resolveRejectCount > 1) {
                    console.error("runBrokenParallelTransactions: Promise has already been resolved/rejected. X" + resolveRejectCount);
                }
                console.log("runBrokenParallelTransactions: Resolving with ", v);
                resolve(v);
            }
            function rejectWrapper(v:any) {
                resolveRejectCount++;
                if (resolveRejectCount > 1) {
                    console.error("runBrokenParallelTransactions: Promise has already been resolved/rejected. X" + resolveRejectCount);
                }
                console.error("runBrokenParallelTransactions: Rejecting with ", v);
                reject(v);
            }

            (trx as any).transaction((trx2: Knex.Transaction) => {
                console.log("Transaction[2] Started");

                (trx2 as any).transaction((trx3: Knex.Transaction) => {
                    console.log("Transaction[3] Started");

                    try {
                        runQuery(trx2, "T[2] Query Executed")
                            .then(r => results.push(r))
                            .then(() => runQuery(trx3, "T[3] Query Executed"))
                            .then(r => results.push(r))
                            .then(() => {
                                console.log("Transaction[2] Committing");
                                return trx2.commit();
                            })
                            .then((z2: any) => {
                                console.log("Transaction[2] Committed");
                                console.log("Transaction[3] Committing");
                                return trx3.commit();
                            })
                            .then((a) => {
                                console.log("Transaction[3] Committed");
                                resolveWrapper(results);
                            })
                            .catch(err => {
                                console.error("Inner-Most Promise Failed");
                                rejectWrapper(err);
                            })
                    } catch(ex) {
                        console.error("Inner-Most Try/Catch Failed");
                        rejectWrapper(ex);
                    }
                }).catch((err: any) => {
                    console.error("Transaction[3] Could not be started");
                    rejectWrapper(err)
                });
            }).catch((err: any) => {
                console.error("Transaction[2] Could not be started");
                rejectWrapper(err)
            });
        });
    }


    function runQuery(trx: Knex.Transaction, v: string): Promise<any> {
        return Promise.resolve(trx.raw(`select ?::text as "V";`, [v]).then());
    }
}