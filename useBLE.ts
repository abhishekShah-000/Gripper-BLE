import { useMemo, useState, useEffect,useRef } from "react";
import { PermissionsAndroid, Platform, Alert } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";
import * as ExpoDevice from "expo-device";
import base64 from "react-native-base64";
import { useData } from './BLEContext';

const HEART_RATE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const HEART_RATE_CHARACTERISTIC = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
const WRITE_CHARACTERISTIC = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (device: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  writeToDevice: (data: string) => Promise<void>;
  readFromDevice: () => Promise<string | null>;
  getWritableCharacteristics: () => Promise<{
    serviceUUID: string;
    characteristicUUID: string;
    isWritableWithResponse: boolean;
    isWritableWithoutResponse: boolean;
  }[]>;
  stopMaxTest: () => void;
  testData: string[];
  currentTest: string | null;
  connectedDevice: Device | null;
  deviceInRange: Device | null; // New state
  allDevices: Device[];
  heartRate: number;
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [deviceInRange, setDeviceInRange] = useState<Device | null>(null); // New state
  const [heartRate, setHeartRate] = useState<number>(0);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [testData, setTestData] = useState<string[]>([]);
  const { setData } = useData();
  const [localData, setLocalData] = useState<string[]>([]);
  useEffect(() => {
    setLocalData(testData);
  }, [testData]);
  useEffect(() => {
    setData(localData);
  }, [localData, setData]);

  
  
  
  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device && device?.name == "Squeezer") {
        setDeviceInRange(device); // Set device in range
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicateDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });
  };

  const connectToDevice = async (device: Device) => {
    try {
      console.log("connect");
      const deviceConnection = await bleManager.connectToDevice(device.id);
      console.log(deviceConnection);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      //await getWritableCharacteristics();
      bleManager.stopDeviceScan(); // Ensure scan is stopped after successful connection
      startMaxTest(deviceConnection);
      startStreamingData(deviceConnection);
      
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
      Alert.alert("Connection Error", "Failed to connect to device.");
    }
  };
  

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setHeartRate(0);
    }
  };

  const readFromDevice = async () => {
    console.log("read");
    if (connectedDevice) {
      try {
        const characteristic = await connectedDevice.readCharacteristicForService(
          HEART_RATE_UUID,
          WRITE_CHARACTERISTIC
        );
        
        if (characteristic && characteristic.value) {
          const decodedValue = base64.decode(characteristic.value);
          console.log("Read value:", decodedValue);
          return decodedValue;
        } else {
          console.log("No data received");
          return null;
        }
      } catch (error) {
        console.log("Error reading characteristic:", error);
        return null;
      }
    } else {
      console.log("No device connected");
      return null;
    }
  };

  const getWritableCharacteristics = async () => {
    let deviceCon = null;
    if(!connectedDevice){
      deviceCon = await bleManager.connectToDevice("84:F7:03:15:84:4A")
    }
  else{
    deviceCon = connectedDevice;
  }
    if (!deviceCon) {
      console.log("No device connected");
      return [];
    }
  
    try {
      const services = await deviceCon.services();
      let writableCharacteristics = [];
  
      for (const service of services) {
        const characteristics = await service.characteristics();
        for (const characteristic of characteristics) {
          console.log("characterstic:",characteristic.isWritableWithResponse, " and ",characteristic.isWritableWithoutResponse );
          if (characteristic.isWritableWithResponse || characteristic.isWritableWithoutResponse) {
            writableCharacteristics.push({
              serviceUUID: service.uuid,
              characteristicUUID: characteristic.uuid,
              isWritableWithResponse: characteristic.isWritableWithResponse,
              isWritableWithoutResponse: characteristic.isWritableWithoutResponse
            });
          }
        }
      }
  
      return writableCharacteristics;
    } catch (error) {
      console.log("Error getting writable characteristics:", error);
      return [];
    }
  };

  const onHeartRateUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null,
  ) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was received");
      return -1;
    }
    const rawData = base64.decode(characteristic.value);
    let innerHeartRate: number = -1;
  
    const firstBitValue: number = Number(rawData) & 0x01;
  
    if (firstBitValue === 0) {
      innerHeartRate = rawData[1].charCodeAt(0);
    } else {
      innerHeartRate =
        Number(rawData[1].charCodeAt(0) << 8) +
        Number(rawData[2].charCodeAt(2));
    }
  
    setHeartRate(innerHeartRate);
  
    // Append data to the single array
    setTestData(prevData => {
      const newData = [...prevData, rawData];
      return newData;
    });

  };

  const writeToDevice = async (data: string) => {
    let deviceCon = null;
    if(!connectedDevice){
      deviceCon = await bleManager.connectToDevice("84:F7:03:15:84:4A")
    }
  else{
    deviceCon = connectedDevice;
  }
    if (deviceCon) {
      try {
        await deviceCon.discoverAllServicesAndCharacteristics();
        console.log(deviceCon.id);
        const encodedData = base64.encode(data);
        await deviceCon.writeCharacteristicWithoutResponseForService(
          HEART_RATE_UUID,
          WRITE_CHARACTERISTIC,
          encodedData
        );
        console.log("Data written successfully");
      } catch (error) {
        console.log("Error writing data:", error);
        Alert.alert("Write Error", "Failed to write data to device.");
      }
    } else {
      console.log("here No device connected");
      Alert.alert("Write Error", "No device connected.");
    }
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        HEART_RATE_UUID,
        HEART_RATE_CHARACTERISTIC,
        onHeartRateUpdate
      );
    } else {
      console.log("streaming No Device Connected");
    }
  };
  const startMaxTest = (device: Device) => {
    if (device) {
      console.log("Starting max test");
      setCurrentTest("maxTest");
    } else {
      console.log("No device connected for max test");
    }
  };
  
  const stopMaxTest = () => {
    if (connectedDevice) {
      //connectedDevice.cancelTransaction('maxTestMonitor');
      console.log("cancel");
    }
  };
  
  // Add similar functions for other test types

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    heartRate,
    writeToDevice,
    readFromDevice,
    getWritableCharacteristics,
    deviceInRange,    
    stopMaxTest,
    currentTest,
    testData,

  };
}

export default useBLE;
