pragma solidity 0.4.25;
pragma experimental ABIEncoderV2;

contract DontWorry {
    address public owner;
    uint public IoTCnt = 0;
    uint public waterQuality;
    uint public gasQuality;
    string[] public waterIoTList;
    string[] public rfidList;
    
    constructor() public {
        owner = msg.sender;
    }
    
    struct Water {
        string waterQuality;
        string time;
    }
    
    struct Gas {
        string gasQuality;
        string time;
    }
    
    mapping(string => uint) waterIoTs; // ip address => ip idex
    mapping(uint => mapping(string => Water[])) waterList; //ip index => (string => Water[])

    mapping(string => uint) rfidPigCnt;
    mapping(string => bool) checkRfid; //Duplicate Check

    function checkIotIdx(string memory _IotIp) public view returns (bool){
        if (waterIoTs[_IotIp] == 0) return false;
        else return true;
    }
    
    function addWaterData(string memory _IotIp, string memory _day, string memory _waterQuality, string memory _measureTime) public{
        bool c = checkIotIdx(_IotIp);
        
        Water memory w;
        w.waterQuality = _waterQuality;
        w.time = _measureTime;
        
        if(c) {
            uint idx = waterIoTs[_IotIp];
            waterList[idx][_day].push(w);
        }
        else {
            waterIoTList.push(_IotIp);
            waterIoTs[_IotIp] = ++IoTCnt;
            waterList[IoTCnt][_day].push(w);
        }
    }
    
    function getWaterData(string memory _IotIp, string memory _day) public view returns(string memory) {
        Water[] memory w = waterList[waterIoTs[_IotIp]][_day];
        string memory s = "";
        for(uint i = 0; i < w.length; i++){
            string memory a = append(w[i].waterQuality, w[i].time);
            s = append(s, a);
        }
        return s;
    }

    function getLatestDataList(string memory _day, string memory _dayBefore) public view returns(string memory) {
        string memory s = "";
        
        for(uint i = 1; i <= waterIoTList.length; i++){
            Water[] memory w = waterList[i][_day];
            string memory a;
            string memory b;

            if(w.length == 0){
                w = waterList[i][_dayBefore];
                a = append(waterIoTList[i-1], " ");
                b = append(w[w.length-1].waterQuality, " ");
            }else{
                a = append(waterIoTList[i-1], " ");
                b = append(w[w.length-1].waterQuality, " ");
            }
            s = append(s, append(a, b));
        }
        return s;
    }

    function getWaterIoTIps() public view returns(string[]) {
        return waterIoTList;
    }

    function getRfidIPs() public view returns(string[]) {
        return rfidList;
    }

    function putPigCnt(string memory _rfidIp, uint _pigCnt) public {
        rfidPigCnt[_rfidIp] = _pigCnt;
        if(!checkRfid[_rfidIp]) {
            rfidList.push(_rfidIp);
            checkRfid[_rfidIp] = true;
        }
    }

    function getPigCnt(string memory _rfidIp) public view returns(uint) {
        return rfidPigCnt[_rfidIp];
    }
    
    function append(string memory a, string memory b) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b));
    }
    
}