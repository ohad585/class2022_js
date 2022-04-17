/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    testTimeout:10000,
    testEnvironment: "node",
    testMatch: ["**/?(*.)+(spec|test).ts"]
};