module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545, // или 8545, если у вас другой порт в Ganache
            network_id: "*", // Т.е. все сети
            networkCheckTimeout: 10000,
        }
    },
    compilers: {
        solc: {
            version: "0.8.19", // используйте вашу версию компилятора
        }
    }
};
