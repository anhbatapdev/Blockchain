// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {
    enum Status {
        Created,
        InProduction,
        Packaged,
        Shipped,
        InTransit,
        Delivered,
        InStore,
        Sold
    }

    enum Role {
        None,
        Producer,
        Distributor,
        Retailer
    }

    struct Product {
        uint256 id;
        string name;
        string description;
        string origin;
        string manufacturer;
        address currentOwner;
        uint256 createdAt;
        Status status;
        bool exists;
    }

    struct HistoryEntry {
        uint256 timestamp;
        address actor;
        Status status;
        string location;
        string details;
    }

    address public owner;
    uint256 public productCount;
    mapping(uint256 => Product) public products;
    mapping(uint256 => HistoryEntry[]) public productHistory;
    mapping(address => Role) public roles;

    event ProductAdded(uint256 indexed id, string name, address indexed producer);
    event StatusUpdated(uint256 indexed id, Status status, address indexed actor);
    event OwnershipTransferred(uint256 indexed id, address indexed from, address indexed to);
    event RoleAssigned(address indexed account, Role role);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier productExists(uint256 _id) {
        require(products[_id].exists, "Product does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function assignRole(address _account, Role _role) public onlyOwner {
        roles[_account] = _role;
        emit RoleAssigned(_account, _role);
    }

    function addProduct(
        string memory _name,
        string memory _description,
        string memory _origin,
        string memory _manufacturer,
        string memory _location,
        string memory _details
    ) public returns (uint256) {
        productCount++;
        uint256 newId = productCount;

        products[newId] = Product({
            id: newId,
            name: _name,
            description: _description,
            origin: _origin,
            manufacturer: _manufacturer,
            currentOwner: msg.sender,
            createdAt: block.timestamp,
            status: Status.Created,
            exists: true
        });

        productHistory[newId].push(
            HistoryEntry({
                timestamp: block.timestamp,
                actor: msg.sender,
                status: Status.Created,
                location: _location,
                details: _details
            })
        );

        emit ProductAdded(newId, _name, msg.sender);

        return newId;
    }

    function updateStatus(
        uint256 _id,
        Status _status,
        string memory _location,
        string memory _details
    ) public productExists(_id) {
        require(
            products[_id].currentOwner == msg.sender,
            "Only current owner can update status"
        );

        products[_id].status = _status;

        productHistory[_id].push(
            HistoryEntry({
                timestamp: block.timestamp,
                actor: msg.sender,
                status: _status,
                location: _location,
                details: _details
            })
        );

        emit StatusUpdated(_id, _status, msg.sender);
    }

    function transferOwnership(
        uint256 _id,
        address _newOwner
    ) public productExists(_id) {
        require(
            products[_id].currentOwner == msg.sender,
            "Only current owner can transfer ownership"
        );
        require(_newOwner != address(0), "New owner cannot be zero address");

        address previousOwner = products[_id].currentOwner;
        products[_id].currentOwner = _newOwner;

        productHistory[_id].push(
            HistoryEntry({
                timestamp: block.timestamp,
                actor: msg.sender,
                status: products[_id].status,
                location: "",
                details: string(
                    abi.encodePacked(
                        "Ownership transferred from ",
                        toAsciiString(previousOwner),
                        " to ",
                        toAsciiString(_newOwner)
                    )
                )
            })
        );

        emit OwnershipTransferred(_id, previousOwner, _newOwner);
    }

    function getProduct(
        uint256 _id
    ) public view productExists(_id) returns (Product memory) {
        return products[_id];
    }

    function getProductHistory(
        uint256 _id
    ) public view productExists(_id) returns (HistoryEntry[] memory) {
        return productHistory[_id];
    }

    function getHistoryCount(
        uint256 _id
    ) public view productExists(_id) returns (uint256) {
        return productHistory[_id].length;
    }

    function getAllProducts() public view returns (Product[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= productCount; i++) {
            if (products[i].exists) {
                count++;
            }
        }

        Product[] memory allProducts = new Product[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= productCount; i++) {
            if (products[i].exists) {
                allProducts[index] = products[i];
                index++;
            }
        }

        return allProducts;
    }

    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(42);
        s[0] = "0";
        s[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint160(x) / (2 ** (8 * (19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2 * i + 2] = char(hi);
            s[2 * i + 3] = char(lo);
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }
}
