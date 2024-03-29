import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import Cookies from 'js-cookie';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '10px',
};

let ScpImage = `
<svg width="45" height="45" version="1.1" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<path d="m51.9 11.9h31.7l3.07 11.4.944.391c19.4 8.03 32 26.9 32 47.9 0 2.26-.149 4.53-.445 6.77l-.133 1.01 8.37 8.37-15.8 27.4-11.4-3.06-.809.623c-9.06 6.95-20.2 10.7-31.6 10.7-11.4 6e-5-22.5-3.77-31.6-10.7l-.81-.623-11.4 3.06-15.8-27.4 8.37-8.37-.133-1.01c-.296-2.25-.445-4.51-.445-6.77.000141-21 12.6-39.9 32-47.9l.944-.391z" fill="#000" stroke="red" stroke-width="6"/>
  <circle cx="67.7" cy="71.5" r="33" fill="#000" stroke="red" stroke-width="8"/>
  <path id="b" d="m64.7 30.6v24h-5.08l8.08 14 8.08-14h-5.08l-.000265-24h-5.99" fill="red"/>
  <path transform="rotate(120 67.7 71.5)" d="m64.7 30.6v24h-5.08l8.08 14 8.08-14h-5.08l-.000265-24h-5.99" fill="red"/>
  <path transform="rotate(240 67.7 71.5)" d="m64.7 30.6v24h-5.08l8.08 14 8.08-14h-5.08l-.000265-24h-5.99" fill="red"/>
</svg>
`;


let ScpImageBlue = ScpImage.replace(/red/g, "#38FFF6");

let SkullImage = `
<svg width="45" height="45" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 90 112.5"><desc iVinci="yes" version="4.4" gridStep="20" showGrid="no" snapToGrid="no" codePlatform="0"/><g><g><desc type="0" basicInfo-basicType="0" basicInfo-roundedRectRadius="12" basicInfo-polygonSides="6" basicInfo-starPoints="5" bounding="rect(-260.473,-361.902,520.946,723.805)" text="" font-familyName="Helvetica" font-pixelSize="20" font-bold="0" font-underline="0" font-alignment="1" strokeStyle="0" markerStart="0" markerEnd="0" shadowEnabled="0" shadowOffsetX="0" shadowOffsetY="2" shadowBlur="4" shadowOpacity="160" blurEnabled="0" blurRadius="4" transform="matrix(0.137774,0,0,0.124356,45,45.0047)" pers-center="0,0" pers-size="0,0" pers-start="0,0" pers-end="0,0" locked="0" mesh="" flag=""/><path d="M79.7375,20.7201 C83.2026,31.3162 77.7257,51.0143 77.7257,51.0143 C77.7257,51.0143 76.5751,56.7002 79.103,57.0736 C80.2155,57.2379 79.225,64.6326 77.5237,66.5176 C76.3322,67.8378 73.468,69.9677 71.7329,69.428 C69.9977,68.8883 61.5331,64.4992 64.0111,77.3309 C63.8163,78.5607 63.2393,78.875 62.8478,79.0138 C62.4563,79.1525 62.1418,79.0657 61.6345,79.5129 C61.1308,79.9571 60.467,80.2709 60.5636,81.5948 C60.6001,82.0962 60.0686,80.9583 59.7024,82.6159 C59.6197,82.9897 59.2422,81.6587 57.5553,83.2665 C56.5813,82.4061 56.0746,81.9364 54.539,83.6443 C52.6687,82.0631 51.856,83.206 50.7461,84.3065 C49.0891,82.7122 47.8765,82.1074 45.3728,84.6332 C41.9561,81.1237 40.9601,84.3693 39.8408,84.4491 C39.5462,84.6085 38.692,81.498 36.1884,83.6514 C34.3327,81.1522 33.2134,83.3589 33.2134,83.3589 C33.2134,83.3589 32.153,82.0296 31.2988,82.5613 C30.7135,82.9257 30.8569,81.3916 29.3607,79.8446 C28.2201,78.6653 28.5889,79.2913 27.8231,79.2116 C27.3407,79.17 26.4412,77.7963 26.4663,77.3144 C26.4663,76.3459 30.083,64.1213 18.6023,69.3838 C16.6814,70.2643 13.889,68.3127 13.1685,66.6399 C12.4479,64.9673 10.2302,60.6962 11.1191,57.3439 C11.347,56.4848 12.8426,57.2111 12.6597,52.2211 C12.655,49.7224 5.47803,29.3464 11.5575,18.272 C17.6369,7.19747 29.7947,1.34977 43.9311,0.0774803 C52.6419,-0.706463 74.3824,4.34362 79.7375,20.7201 M78.4044,21.3029 C78.3856,21.3134 78.3606,21.3182 78.3484,21.3349 C78.1462,21.6093 77.8397,22.3723 77.7172,22.6545 C77.5808,22.9687 77.2493,23.7858 77.2017,23.9089 C76.7862,24.9824 76.5043,25.7238 76.1613,26.7445 C75.6618,28.2315 75.4293,29.0019 74.9626,30.6931 C74.539,32.2284 74.1859,33.9493 74.1973,35.5338 C74.203,36.3183 74.2397,37.1022 74.4671,37.8625 C74.6323,38.4144 74.9444,38.9359 75.0177,39.5088 C75.1014,40.1631 75.0407,39.8399 75.0827,40.3013 C75.1516,41.0565 75.1875,41.4024 75.2965,42.1538 C75.7105,45.0081 76.2234,47.8489 76.7352,50.6899 C76.4234,47.9185 76.438,48.1523 76.1227,44.6229 C76.0391,43.6869 75.9028,41.7979 75.8544,40.819 C75.8056,39.8297 75.7411,38.5845 75.7951,37.5596 C75.8473,36.5676 75.9614,35.8198 76.1063,34.7758 C76.2161,33.9857 76.6824,31.3731 76.7006,31.2724 C77.1403,28.8408 77.6315,26.4168 78.0833,23.987 C78.2236,23.233 78.2431,23.0844 78.3626,22.3275 C78.3954,22.1206 78.4301,21.9119 78.4445,21.7031 C78.4503,21.6175 78.4739,21.4292 78.423,21.3289 L78.4044,21.3029 M12.1507,21.3029 C12.14,21.3207 12.12,21.3361 12.1182,21.3565 C12.0867,21.701 12.1531,22.0593 12.1987,22.3959 C12.2698,22.9206 12.3731,23.4413 12.4668,23.963 C12.6272,24.8563 13.2008,27.8223 13.2481,28.0693 C13.5936,29.8811 13.941,31.6911 14.2463,33.5085 C14.4721,34.8525 14.6799,36.2014 14.76,37.5596 C14.8078,38.3693 14.7785,39.1841 14.7366,39.9935 C14.6957,40.7854 14.6578,41.5776 14.6053,42.369 C14.4208,45.1487 14.1213,47.9193 13.82,50.6899 C13.9498,49.98 14.0852,49.2709 14.2094,48.5602 C14.5999,46.3256 15.0093,44.0754 15.304,41.8251 C15.3596,41.4008 15.4158,40.9769 15.4526,40.5508 C15.4791,40.2456 15.4765,39.9373 15.5171,39.6329 C15.6151,38.8986 16.027,38.2373 16.1791,37.5153 C16.3385,36.758 16.373,35.9855 16.349,35.216 C16.3407,34.9481 16.3384,34.6796 16.309,34.4129 C16.2502,33.879 16.1714,33.3469 16.0846,32.8162 C16.0413,32.551 15.9799,32.2886 15.9191,32.0264 C15.5589,30.4722 15.353,29.7997 14.8231,28.054 C14.6898,27.615 14.5425,27.1795 14.3938,26.7445 C13.8848,25.256 13.3266,23.7818 12.6974,22.3313 C12.6057,22.1187 12.5176,21.9044 12.4147,21.6959 C12.3865,21.6385 12.2833,21.387 12.1806,21.3169 L12.1507,21.3029 M63.6183,40.108 C60.6142,40.1828 56.9498,40.1553 54.711,42.3022 C52.7179,44.2136 52.6435,47.086 52.8405,49.5457 C53.1406,52.7689 59.0792,58.4748 65.3073,58.1122 C72.7874,57.6766 71.8242,54.1711 73.1092,49.1101 C74.8787,42.1407 70.6157,40.0354 63.6183,40.108 M17.5468,49.1101 C18.8318,54.1711 17.8685,57.6766 25.3486,58.1122 C31.5767,58.4748 37.5155,52.7689 37.8155,49.5457 C38.0846,46.5271 37.7923,42.8379 34.4509,41.2558 C32.1725,40.1772 29.5456,40.1738 27.0377,40.108 C20.0401,40.0354 15.7774,42.1407 17.5468,49.1101 M46.2063,54.5948 C46.0659,54.5937 45.9476,54.6115 45.8363,54.6894 C45.5499,54.8898 45.5293,55.673 45.5263,55.979 C45.5223,56.4115 45.5317,56.8308 45.5641,57.2597 C45.6848,58.8555 45.8859,60.444 46.0465,62.0368 C46.1058,62.6227 46.1179,62.7787 46.128,63.367 C46.1284,63.393 46.1105,63.5997 46.1094,63.6256 C46.1021,63.8054 46.1073,64.0054 46.1126,64.1809 C46.1306,64.7875 46.1819,65.3932 46.2469,65.9971 C46.4202,67.608 46.6421,69.217 46.858,70.8243 C46.858,70.8243 46.8299,72.7232 49.4614,71.7544 C50.5945,71.3373 51.0844,71.8199 52.0106,68.3274 C52.2063,67.4986 52.299,67.1815 52.4031,66.2047 C52.5616,64.7147 52.3099,63.1589 51.3856,61.8929 C51.0694,61.4599 50.7385,61.0795 50.3949,60.6698 C50.0591,60.2693 49.6991,59.857 49.5063,59.3789 C49.4554,59.2521 49.2731,58.7503 49.31,58.5908 L49.3327,58.5975 C49.32,58.3424 49.2284,58.0492 49.1453,57.8073 C48.8745,57.0193 48.5575,56.4275 47.9943,55.775 C47.5706,55.2843 47.0185,54.764 46.3247,54.6143 L46.2063,54.5948 M44.3534,54.5948 C44.2752,54.6098 44.1955,54.62 44.1186,54.6396 C43.6525,54.7579 43.0978,55.2067 42.8072,55.5058 C42.1848,56.1461 41.7066,56.8855 41.4426,57.7032 C41.3559,57.9717 41.3161,58.1143 41.2792,58.3652 C41.222,58.7534 41.1967,59.1132 41.0092,59.4764 C40.607,60.2553 39.9471,60.8715 39.4074,61.5682 C39.1642,61.8825 38.9444,62.2124 38.7547,62.5558 C38.0985,63.7427 38.0348,65.1378 38.1815,66.4319 C38.2653,67.1707 38.3908,67.6516 38.5492,68.3274 C39.4755,71.8199 39.9655,71.3373 41.0986,71.7544 C43.7299,72.7232 43.702,70.8243 43.702,70.8243 C43.9632,68.9483 44.014,68.6496 44.2674,66.3729 C44.3482,65.6461 44.4125,64.9135 44.447,64.1827 C44.4616,63.8725 44.4408,63.5662 44.4339,63.2558 C44.4268,62.9269 44.4627,62.5953 44.4909,62.2682 C44.6709,60.1737 45.0532,58.0845 45.0335,55.979 C45.0302,55.6251 45.0176,54.9854 44.7453,54.7105 C44.663,54.6273 44.569,54.6114 44.4563,54.5981 L44.3534,54.5948 M39.8408,88.6904 C39.8032,90.2224 44.8539,90.2895 45.1944,89.5555 C45.5883,88.7067 45.2447,85.0936 44.9809,84.7238 C43.2968,82.3647 41.4779,82.9433 40.4808,84.5414 C39.8445,85.5614 39.8746,87.3142 39.8408,88.6904 M39.362,88.6717 C39.9024,88.2417 39.6549,84.7589 39.4437,84.3998 C38.6125,82.9873 37.7238,82.828 36.8783,83.3391 C36.1583,83.7742 35.4683,86.3375 35.4882,87.1681 C35.5173,88.3795 37.8972,89.8374 39.362,88.6717 M33.4595,83.3185 C34.1573,81.8733 35.7773,82.9503 35.9405,83.9344 C36.1038,84.9184 34.9494,86.3354 35.3979,87.7413 C35.5094,88.0913 34.76,88.5041 34.1778,88.4643 C33.5957,88.4246 33.2606,87.3996 33.1493,86.7337 C33.0089,85.8939 33.1043,84.0542 33.4595,83.3185 M31.2411,82.7593 C31.8915,82.1109 33.1539,83.2432 33.0364,83.6517 C32.8562,84.2783 32.9068,84.5762 32.7703,86.8735 C32.7555,87.1226 31.9891,87.4564 31.7395,87.538 C31.49,87.6196 31.0348,86.769 30.9559,86.2848 C30.9143,86.031 30.7361,83.2624 31.2411,82.7593 M30.2957,81.8733 C30.0494,81.7986 29.5872,82.7619 29.4986,83.0731 C29.3149,83.7176 29.6224,85.3429 29.6836,85.5599 C29.7692,85.8634 30.7823,86.5877 30.7644,86.4564 C30.4455,84.1014 30.8993,82.9006 30.8915,82.7493 C30.8838,82.5983 30.5423,81.948 30.2957,81.8733 M28.7942,79.7832 C28.5086,79.759 28.229,81.71 27.9087,82.7375 C27.8077,83.0611 28.452,84.0603 28.5086,84.1712 C28.5654,84.282 29.1497,85.4804 29.2426,85.1588 C29.3502,84.7864 29.1696,83.6394 29.1798,83.4021 C29.2158,82.563 29.7311,82.0773 29.9062,81.7506 C30.4181,80.7967 29.1783,79.8159 28.7942,79.7832 M27.5853,82.9108 C27.7627,82.6572 28.3276,79.783 28.5086,79.5643 C28.6793,79.3582 28.1524,79.4068 27.5724,79.5065 C27.1308,79.5825 27.0985,81.1828 27.2018,81.526 C27.3053,81.8691 27.408,83.1642 27.5853,82.9108 M50.905,88.6904 C50.9427,90.2224 45.8918,90.2895 45.5513,89.5555 C45.1574,88.7067 45.501,85.0936 45.7649,84.7238 C47.449,82.3647 49.2679,82.9433 50.2649,84.5414 C50.9011,85.5614 50.8713,87.3142 50.905,88.6904 M51.3838,88.6717 C50.8434,88.2417 51.0908,84.7589 51.3019,84.3998 C52.1333,82.9873 53.0218,82.828 53.8673,83.3391 C54.5873,83.7742 55.2774,86.3375 55.2575,87.1681 C55.2284,88.3795 52.8486,89.8374 51.3838,88.6717 M57.2862,83.3185 C56.5886,81.8733 54.9684,82.9503 54.8051,83.9344 C54.6419,84.9184 55.7965,86.3354 55.3479,87.7413 C55.2363,88.0913 55.9857,88.5041 56.5678,88.4643 C57.15,88.4246 57.485,87.3995 57.5963,86.7337 C57.7368,85.8939 57.6414,84.0542 57.2862,83.3185 M59.5047,82.7591 C58.8543,82.1109 57.5918,83.2432 57.7093,83.6517 C57.8895,84.2783 57.8389,84.5762 57.9753,86.8733 C57.9902,87.1225 58.7567,87.4564 59.0062,87.538 C59.2558,87.6196 59.7109,86.769 59.79,86.2848 C59.8313,86.031 60.0096,83.2624 59.5047,82.7591 M60.4499,81.8733 C60.6964,81.7986 61.1585,82.7619 61.2473,83.0731 C61.4307,83.7176 61.1232,85.3429 61.0621,85.5599 C60.9766,85.8634 59.9635,86.5877 59.9812,86.4564 C60.3001,84.1014 59.8465,82.9006 59.8542,82.7493 C59.8621,82.5983 60.2035,81.948 60.4499,81.8733 M61.9517,79.7832 C62.2371,79.759 62.5167,81.71 62.8372,82.7375 C62.938,83.061 62.2937,84.0603 62.2371,84.1711 C62.1805,84.282 61.5961,85.4804 61.503,85.1588 C61.3955,84.7864 61.5761,83.6394 61.5659,83.4021 C61.5301,82.563 61.0148,82.0773 60.8394,81.7506 C60.3276,80.7967 61.5676,79.8159 61.9517,79.7832 M63.1603,82.9108 C62.983,82.6572 62.418,79.783 62.2371,79.5643 C62.0666,79.3582 62.5934,79.4068 63.1733,79.5065 C63.6149,79.5825 63.6474,81.1828 63.5439,81.526 C63.4406,81.8691 63.3377,83.1642 63.1603,82.9108 " style="" stroke="none" fill-rule="evenodd" fill="#f00" fill-opacity="1"/></g></g><text x="0" y="105" fill="#f00" font-size="5px" font-weight="bold" font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">Created by Mark S Waterhouse</text><text x="0" y="110" fill="#f00" font-size="5px" font-weight="bold" font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">from the Noun Project</text></svg>
`;

// const markersData = [
//   { position: {lat: 50.04333033301378, lng: 14.550520912481383}, name: 'Marker 1', color: '#EB00FF', type: 1 },
//   { position: {lat: 50.04420537349102, lng: 14.554050699546323}, name: 'Marker 2', color: '#EB0055', type: 0 },
//   // Add more markers as needed
// ];

class Mark {
  constructor(id, position, title, type, ) {
      this.position = position;
      this.title = title;
      this.type = type;
      this.type = id;
  }
}

// Create instances of Mark
// const mark1 = new Mark(0, {lat: 50.04333033301378, lng: 14.550520912481383}, 'Marker Test 1', '#EB00FF', 1);
function AdminView() {
  const [adminName, setAdminName] = useState(Cookies.get('adminName'));
  const [initFetch, setInitFetch] = useState(false);
  const [initPos, setInitPos] = useState(false);
  const [adminType, setAdminType] = useState('SCP Foundation');
  const [price, setPrice] = useState(0);

  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationDescription, setNotificationDescription] = useState('');

  const [time, setTime] = useState(new Date());
  const [timer, setTimer] = useState(new Date());
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [markersData, setMarkersData] = useState([
    // Add more markers as needed
  ]);
  const [notification, setNotification] = useState([]);
  const [id, setId] = useState("");
  
  

  // We make a function to fetch data whenever we need to
const fetchMarks= () => {
  fetch("/api/markers")
    .then((response) => response.json())
    .then((data) => {
      setMarkersData(data);
      console.log(data);
    });
};
const fetchTimer= () => {
  fetch("/api/timer")
    .then((response) => response.json())
    .then((data) => {
      const dateObject = new Date(data);
      console.log(dateObject);
      setTimer(dateObject);
    });
};
const fetchNotifications= () => {
  fetch("/api/notifications")
    .then((response) => response.json())
    .then((data) => {
      setNotification(data);
    });
}


const postMark = () => {
  const typeNum = adminType === "SCP Foundation" ? 1 : 0;
  const markData = {
    position: userLocation,
    title: adminName,
    type: typeNum,
    id: "monster",
    price: null
  };
  if(typeNum === 0) {
    markData.price = price;
  }
  fetch("/markers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(markData)
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};

const removeMark = (id) => {
  fetch(`/api/markers/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to delete mark');
    }
    console.log('Mark deleted successfully');
    // Handle success
  })
  .catch(error => {
    console.error('Error deleting mark:', error);
    // Handle error
  });

  // Remove mark from state
  setMarkersData(markersData.filter((mark) => mark.id !== id));
};

const postNotification = () => {
  const notificationData = {
    title: notificationTitle,
    description: notificationDescription
  };
  fetch("/api/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(notificationData)
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};

const removeNotification = (id) => {
  fetch(`/api/notifications/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })

  // Remove notification from state
  setNotification(notification.filter((note) => note.id !== id));
};

  useEffect(() => {
    Cookies.set('adminName', adminName, { expires: 7 });
  }, [adminName])

  useEffect(() => {
    if(price === NaN) setPrice(0);
    // Check if its initial check, we get the data from the server
    if(!initFetch){
      console.log("Init fetch done");
      setInitFetch(true);
      fetchMarks();
      fetchTimer();
      fetchNotifications();
    }

    if(!initPos && userLocation != null){
      if (navigator.geolocation) {
        console.log("Init pos done fetch");
        setInitPos(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      }
    }

    const interval = setInterval(() => {
      const currentTime = new Date();
      setTime(currentTime);


      // Check if current time is equal to timer
      if (currentTime.getTime() >= timer.getTime()) {
        // Set timer to the next minute
        const nextMinute = new Date(timer.getTime());
        nextMinute.setMinutes(nextMinute.getMinutes() + 1);
        setTimer(nextMinute);

        // postMark();

        fetchMarks();
        fetchTimer();
        fetchNotifications();
        //{id: 84, position: {lat: 50.0430755, lng: 14.5529717}, title: "Tau-5", color: "#38FFF6"}
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]); // Added timer as a dependency for useEffect

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const GetTime = () => {
    let t = parseInt((timer.getTime() - time.getTime()) / 1000);
    let minutes = (Math.floor(t/60)).toString().split("");
    let seconds = (t%60).toString().split("");

    let ret = [];
    // ret.push(<h2 key={0} className='timer'>{t} - {minutes} - {seconds}</h2>);
    // Minutes
    for (let i = 0; i < 2 - minutes.length; i++) {
      ret.push(<h2 key={i + 1} className='timer'>0</h2>);
    }
    for (let i = 0; i < minutes.length; i++) {
      ret.push(<h2 key={i + 2} className='timer'>{minutes[i]}</h2>);
    }

    ret.push(<h2 key={3} className='timer'>:</h2>);

    // Seconds
    for (let i = 0; i < 2 - seconds.length; i++) {
      ret.push(<h2 key={i + 4} className='timer'>{0}</h2>);
    }
    for (let i = 0; i < seconds.length; i++) {
      ret.push(<h2 key={i + 5} className='timer'>{seconds[i]}</h2>);
    }

    return <div className='timerBox'>{ret}</div>;
  };


  const onLoad = (map) => {
    setMap(map);
  };

  return (
    <div className="app">
      <h1>SCP Foundation - Radar Admin</h1>
      <div className='whole'>
        <div className='radar'>
        <div className='notifications'>
        <div>
          {notification.map((note) => (
            <div key={note.id} className='notificationAdmin'>
              <h2>IMPORTANT NEWS</h2>
              <h3>{note.title}</h3>
              <p>{note.description}</p>
            </div>
          ))}
        </div>
      </div>
          <h2 className='timer-text'>Next Scan in</h2>
          <div className="timer-section">
            <h2 className='timerBox'>
            {GetTime()}
            </h2>
            {/* <h2>Time Elapsed: {time.toLocaleTimeString()} seconds</h2>
            <h2>Time Elapsed: {timer.toLocaleTimeString()} seconds</h2> */}
          </div>
          <div className="map-section">
            <LoadScript googleMapsApiKey="AIzaSyCqF2HVzNzRlZg7z6XZBWKsHuDgFWJ8KP8">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={userLocation}
                options={{
                  streetViewControl: false, // Removes Street View control
                  mapTypeControl: false, // Removes the map type control
                }}
                zoom={15}
                onLoad={onLoad}
              >
                {/* {userLocation && (
                  <MarkerF position={userLocation} name="Your Location" />
                )} */}
                {markersData.map((marker) => (
                  <MarkerF
                    key={marker.index}
                    position={marker.position}
                    name={marker.title}
                    color={marker.color}
                    type={marker.type}
                    price={marker.price}
                    date={marker.date}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
        <div className='admin'>
            <h2>Admin Panel</h2>
            <div className='split'>
              <div className='markList'>

                <div className='lists'>
                  <div>
                  <h2>Mark list</h2>
                    <table className='markListInner'>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Position</th>
                          <th>Marker Type</th>
                          <th>Actions</th> {/* Assuming you decide to keep this */}
                        </tr>
                      </thead>
                      <tbody>
                        {markersData.map((marker, index) => (
                          <tr key={index} className='markItem'>
                            <td>{marker.title}</td>
                            <td>{marker.position.lat}, {marker.position.lng}</td>
                            <td>
                              <div className="svg-container">
                                <div dangerouslySetInnerHTML={{ __html: marker.type === 0 ? SkullImage : ScpImageBlue }} />
                              </div>
                            </td>
                            <td><button onClick={() => removeMark(marker.id)}>Remove</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h2>Notification list</h2>
                    <table className='markListInner'>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Description</th>
                          <th>Actions</th> {/* Assuming you decide to keep this */}
                        </tr>
                      </thead>
                      <tbody>
                        {notification.map((note, index) => (
                          <tr key={index} className='markItem'>
                            <td>{note.title}</td>
                            <td>{note.description}</td>
                            <td><button onClick={() => removeNotification(note.id)}>Remove</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                  
              </div>
              <div className='maker'>
                <h2>Create a new mark</h2>
                <div>
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={adminName}
                    onChange={(e) => setAdminName((Number)(e.target.value))}
                  />
                  <div>
                  <label htmlFor="lat">lat:</label>
                  <input
                    type="text"
                    id="lat"
                    name="lat"
                    value={(userLocation !== null && userLocation !== undefined ) ? userLocation.lat : ''}
                    onChange={(e) => setUserLocation({...userLocation, lat: (Number)(e.target.value)})}
                  />
                  <label htmlFor="lng">lng:</label>
                  <input
                    type="text"
                    id="lng"
                    name="lng"
                    value={(userLocation !== null && userLocation !== undefined ) ? userLocation.lng : ''}
                    onChange={(e) => setUserLocation({...userLocation, lng: (Number)(e.target.value)})}
                  />

                  </div>
                </div>
                <div>
                <label htmlFor="price">Price:</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={price}
                    onChange={(e) => setPrice((Number)(e.target.value))}
                  />
                </div>
                <div>
                  <label htmlFor="type">Type:</label>
                  <select
                    id="type"
                    name="type"
                    value={adminType}
                    onChange={(e) => setAdminType(e.target.value)}
                  >
                    <option value="SCP Foundation">SCP Foundation</option>
                    <option value="Monster">Monster</option>
                  </select>
                </div>
                <button onClick={() => postMark()}>Create</button>

              </div>
              <div className='maker'>
                <h2>Notifications</h2>
                <div>
                  <label htmlFor="notificationTitle">Title:</label>
                  <input
                    type="text"
                    id="notificationTitle"
                    name="Title"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="notificationDescription">Description:</label>
                  <textarea
                    type="text"
                    id="notificationDescription"
                    name="Description"
                    value={notificationDescription}
                    onChange={(e) => setNotificationDescription(e.target.value)}
                  />
                </div>
                <button onClick={() => {postNotification()}}>Create</button>
              </div>
            </div>
        </div>


      </div>

    </div>
  );
  function MarkerF({ index, position, name, color, type, price, date }) {
    let icon;
    if (type === 0) {
      icon = SkullImage;
    } else {
      icon = ScpImage.replace(/red/g, color); // Replace all occurrences of "#0062ff"
      // console.log(icon);
    }

    var dateLabel = "";
    // Format date to hours and minutes
    if(date !== undefined){
      var formattedDate = new Date(date);
      var hours = formattedDate.getHours();
      var minutes = formattedDate.getMinutes();
      // Add leading zeros if necessary
      var hoursStr = hours < 10 ? "0" + hours : hours;
      var minutesStr = minutes < 10 ? "0" + minutes : minutes;
      dateLabel = hoursStr + ":" + minutesStr;
    }
    
    return (
      <div>
        <Marker
          position={position}
          label={name}
          draggable={false}
          icon={{
            url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(icon)}`,
            scale: 7,
            scaledSize: new window.google.maps.Size(40, 40), // Set the size here (width, height),
            labelOrigin: new window.google.maps.Point(20, 45), // Adjust the x and y offset hereS
          }}
        >
        </Marker>
        {(price !== undefined && price !== 0) ?         
        <Marker
          position={position}
          label={"BOUNTY: " + price}
          draggable={false}
          icon={{
            url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(icon)}`,
            scale: 7,
            scaledSize: new window.google.maps.Size(40, 40), // Set the size here (width, height),
            labelOrigin: new window.google.maps.Point(20, 60), // Adjust the x and y offset hereS
          }}
        >
        </Marker>
         : <div></div>} 
        {(date !== undefined) ? <Marker
          position={position}
          label={"AT: "+dateLabel}
          draggable={false}
          icon={{
            url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(icon)}`,
            scale: 7,
            scaledSize: new window.google.maps.Size(40, 40), // Set the size here (width, height),
            labelOrigin: new window.google.maps.Point(20, 60), // Adjust the x and y offset hereS
          }}
        >
        </Marker> : <div></div>}
      </div>
    );
  }
}

export default AdminView;
