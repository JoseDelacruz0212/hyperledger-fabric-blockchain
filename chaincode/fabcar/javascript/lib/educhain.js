/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class EduChain extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Iniciando Libro mayor ===========');

        console.info('============= END :Libro mayor iniciado ===========');
    }

    async queryUser(ctx, userId) {
        const userAsBytes = await ctx.stub.getState(userId);
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${userId} no existe en la red blockchain`);
        }
        console.log(userAsBytes.toString());
        return userAsBytes.toString();
    }

    async createTransaction(ctx, userId,courseName,courseId,evaluationName,evaluationId,time,points,grade,section) {
        console.info('============= START : Comenzando transacción ===========');
        const eduChain = {
        userId,
        courseName,
        courseId,
        evaluationName,
        evaluationId,
        time,
        points,
        grade,
        section,
        isEdited:false
        };

        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(eduChain)));
        console.info('============= END : transacción finalizada  ===========');
    }

    async queryAllTransactions(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeUserPoints(ctx, userId, newPoints) {
        console.info('============= START : Comenzando el cambio de nota ===========');
        const userAsBytes = await ctx.stub.getState(userId);
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${userId} usuario no existe`);
        }
        const eduChain = JSON.parse(userAsBytes.toString());
        eduChain.points = newPoints;
        eduChain.isEdited=true;
        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(eduChain)));
        console.info('============= END : Cambio de nota finalizada ===========');
    }
    async retrieveHistory(ctx, key) {
        console.info('getting history for key: ' + key);
        let iterator = await ctx.stub.getHistoryForKey(key);
        let result = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value) {
                console.info(`found state update with value: ${res.value.value.toString('utf8')}`);
                const obj = JSON.parse(res.value.value.toString('utf8'));
                result.push(obj);
            }
            res = await iterator.next();
        }
        await iterator.close();
        return result;
    }


}

module.exports = EduChain;