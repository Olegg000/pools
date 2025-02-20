
const ERC20 = artifacts.require("ERC20");

contract("ERC20", function (accounts) {
  it("should assert true", async function () {
    await ERC20.deployed();
    assert.isTrue(true);
  });

  it("should have name, symbol, and owner", async function () {
    const instance = await ERC20.deployed();

    // Получаем имя, символ и отправителя
    const result = await instance.getNameAndSymbolAndSender();

    // Проверяем возвращаемые значения
    assert.equal(result[0], "asdsad", "Name is incorrect");
    assert.equal(result[1], "dsdds", "Symbol is incorrect");
    assert.equal(result[2], accounts[0], "Owner is incorrect");
  });
});