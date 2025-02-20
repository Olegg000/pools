const ERC20 = artifacts.require("ERC20");
const Factory = artifacts.require("Factory");
const Pool = artifacts.require("Pool");
const Staking = artifacts.require("Staking");
const Router = artifacts.require("Router");
const fs = require('fs');

module.exports = async function (deployer,network, accounts) {


    // деплой токенов и минт непосредственно
    await deployer.deploy(ERC20,"GerdaCoin","GERDA",12);
    const gerda = await ERC20.deployed();
    await gerda.mint(accounts[1],100000);

    await deployer.deploy(ERC20,"KrendelCoin","KRENDEL",12);
    const krendel = await ERC20.deployed();
    await krendel.mint(accounts[1],150000);

    await deployer.deploy(ERC20,"RTKCoin","RTK",12);
    const rtk = await ERC20.deployed();
    await rtk.mint(accounts[1],300000);

    await deployer.deploy(ERC20,"LPToken","LP",12);
    const LP = await ERC20.deployed();


    // console.log("     -------       ");
    //
    // // первое действие демонстрации решения - от имени владельца
    // // распределяем пользователем том и бен по 10 000 всех токенов
    // await gerda.transfer(users.Tom.address, 10000,{from:users.Owner.address});
    // await krendel.transfer(users.Tom.address, 10000,{from:users.Owner.address});
    // await rtk.transfer(users.Tom.address, 10000,{from:users.Owner.address});
    //
    // await gerda.transfer(users.Ben.address, 10000,{from:users.Owner.address});
    // await krendel.transfer(users.Ben.address, 10000,{from:users.Owner.address});
    // await rtk.transfer(users.Ben.address, 10000,{from:users.Owner.address});
    //
    // console.log(await gerda.balanceOf(users.Ben.address) + " " + await gerda.balanceOf(users.Tom.address))
    //
    //
    // console.log("     -------       ");

    await deployer.deploy(Staking,await LP.address);
    const staking = await Staking.deployed();

    // разрешаем минтинг стейкинг контракту
    await LP.canMintAdd(staking.address);

    // инициализация фактори
    await deployer.deploy(Factory,6,LP.address);
    const factory = await Factory.deployed();
    // ВАЖНО: передаем владение лп токена фактори чтобы остальные пулы могли минтить токены

    await LP.changeOwnership(factory.address);
    await factory.createPool(gerda.address, krendel.address,"Pool1",{ from: accounts[2] });
    await factory.createPool(krendel.address,rtk.address,"Pool2",{ from: accounts[3] });
    const createPools = await factory.getAllPool()

    console.log(createPools)
    // инициализация первого пула в фабрике (владелец тут том)
    const pool1 = await Pool.at(createPools[0]);
    await gerda.approve(createPools[0],1500,{ from: accounts[1]     })
    await krendel.approve(createPools[0],1500,{ from: accounts[1] })
    await pool1.liquidityTokenAdd(1500,1, { from: accounts[1] })
    await pool1.liquidityTokenAdd(1500,2, { from: accounts[1] })

    // инициализация второго пула в ф   абрике (владелец тут бен)
    const pool2 = await Pool.at(createPools[1]);
    await krendel.approve(createPools[1],3000,{ from: accounts[1] })
    await rtk.approve(createPools[1],3000,{ from: accounts[1] })
    await pool2.liquidityTokenAdd(3000,1, { from: accounts[1] })
    await pool2.liquidityTokenAdd(3000,2, { from: accounts[1]})

    // деплой стакинга и роутера
    await deployer.deploy(Router,await factory.address);
    const router = await Router.deployed();

    // сохранение адрессов важных контрактов в файл
    const data = {
        ownerAddress: accounts[1],
        factoryAddress: factory.address,
        stakingAddress: staking.address,
        routerAddress: router.address,
        gerdaAddress: gerda.address,
        krendelAddress: krendel.address,
        rtkAddress: rtk.address,
        LPAddress: LP.address,
    };
    await fs.writeFileSync("./react-type/test-test/src/MainAddresses.json", JSON.stringify(data, null, 2));
    await fs.copyFileSync("./build/contracts/ERC20.json", "./react-type/test-test/src/api/jsons/ERC20.json")
    await fs.copyFileSync("./build/contracts/Factory.json", "./react-type/test-test/src/api/jsons/Factory.json")
    await fs.copyFileSync("./build/contracts/Pool.json", "./react-type/test-test/src/api/jsons/Pool.json")
    await fs.copyFileSync("./build/contracts/Router.json", "./react-type/test-test/src/api/jsons/Router.json")
    await fs.copyFileSync("./build/contracts/Staking.json", "./react-type/test-test/src/api/jsons/Staking.json")
}