// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ERC20 {

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) private canMint;

    address public owner;
    string public name;
    string public symbol;
    uint256 public decimals;

    uint256 public totalSupply;

    constructor(string memory _name,string memory _symbol, uint256 _decimals) {
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
        decimals = _decimals;
    }

    function changeOwnership(address userChangToAddr) external {
        require(msg.sender == owner,"Only owner can change ownership of Token");
        owner = userChangToAddr;
    }

    function transfer(address _to, uint256 _value) external returns (bool success) {
        require(_value <= balanceOf[msg.sender], "Not enough money");
        require(_value > 0, "Value must be greater than 0");
        balanceOf[_to] += _value;
        balanceOf[msg.sender] -= _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success) {
        require(_value <= balanceOf[_from], "Not enough money");
        require(_value <= allowance[_from][msg.sender],"Not allowance");
        require(_value > 0, "Value must be greater than 0");
        allowance[_from][msg.sender] -= _value;
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) external returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == owner || canMint[msg.sender] == true, "You are not owner of this Token");
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }
    function burn(address from, uint256 amount) external {
        require(msg.sender == owner, "You are not owner of this Token");
        //* (10 ** decimals)
        totalSupply -= amount;
        balanceOf[from] -= amount;
        emit Transfer(from, address(0), amount);
    }
    function canMintAdd(address allowed) external {
        require(msg.sender == owner, "You are not owner");
        canMint[allowed] = true;
    }
}