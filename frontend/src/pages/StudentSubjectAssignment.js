import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import TopNav from '../components/topnav/TopNav';
import Badge from '../components/badge/Badge';
import { MdDelete } from 'react-icons/md';
import { VscReport } from 'react-icons/vsc';

const StudentSubjectAssingment = () => {
  const siteId = localStorage.getItem('site');
  const [Materials, setMaterials] = useState([]);
  const fields = [
    '',
    'Required Date',
    'Item',
    'Quantity',
    'Order Status',
    'Delivery Status',
    'Action',
    'Goods Receipt',
  ];
  const [OrderDetail, setOrderDetail] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [Trigger, setTrigger] = useState(false);
  const [Name, setName] = useState('');
  const [Id, setId] = useState('');
  const [ItemName, setItemName] = useState('');
  const [Description, setDescription] = useState('');
  const [data, setData] = useState({
    id: '1',
    comment: 'comment',
    type: 'use case',
  });
  const [file, setFile] = useState(null);

  const [Order, setOrder] = useState({
    item: {},
    quantity: 0,
    siteid: siteId,
    requiredDate: '',
    urgentOrder: false,
  });
  console.log(Order);

  const FetchData = async () => {
    const resMaterials = await axios.get(`materials`);
    setMaterials(resMaterials.data.materials);

    const resOrders = await axios.get('/orders');
    setOrderDetail(resOrders.data.orders);

    if (resOrders.statusText === 'OK') {
      setLoading(true);
    }
  };

  const fileHandler = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  useEffect(() => {
    FetchData();
  }, []);

  const upload = async (e) => {
    console.log(data);
    console.log(file);
    try {
      const formData = new FormData();
      formData.append('jsondata', data);
      formData.append('file', file);
      console.log(formData);
      const res = await axios.post('/submissions/upload', formData);
      if (res.statusText === 'OK') {
        console.log(res.data);
      }
    } catch (Err) {
      console.log(Err.response);
    }
  };

  const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

  const renderOrderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.requiredDate}</td>
      <td>{item.itemName}</td>
      <td>{item.quantity}</td>
      <td>
        <div className="row-user" style={{ paddingTop: '0' }}>
          {item.isApprovedByOfficer === 'rejected' ? (
            <Badge type="danger" content={item.isApprovedByOfficer} />
          ) : item.isApprovedByManager === 'rejected' ? (
            <Badge type="danger" content={item.isApprovedByManager} />
          ) : item.isApprovedByManager === 'pending' ? (
            <Badge type="warning" content={item.isApprovedByManager} />
          ) : item.isApprovedByManager === 'approved' ? (
            <Badge type="success" content={item.isApprovedByManager} />
          ) : (
            ''
          )}
        </div>
      </td>
      <td>
        <div className="row-user" style={{ paddingTop: '0' }}>
          {item.isApprovedByManager === 'approved' ? (
            item.DeliveryStatus === 'pending' ? (
              <Badge type="warning" content={item.DeliveryStatus} />
            ) : item.DeliveryStatus === 'preparing' ? (
              <Badge type="primary" content={item.DeliveryStatus} />
            ) : item.DeliveryStatus === 'delivering' ? (
              <Badge type="success" content={item.DeliveryStatus} />
            ) : item.DeliveryStatus === 'delivered' ? (
              <Badge type="success" content={item.DeliveryStatus} />
            ) : item.DeliveryStatus === 'submitted' ? (
              <Badge type="normal" content={item.DeliveryStatus} />
            ) : (
              ''
            )
          ) : (
            ''
          )}
        </div>
      </td>
      <td className="">
        {item.isApprovedByManager === 'pending' &&
        !(item.isApprovedByOfficer === 'rejected') ? (
          <>
            <button className="action-btn x">
              <MdDelete
                onClick={() => {
                  if (window.confirm('Are you sure to delete this request?')) {
                  }
                }}
              />
            </button>
          </>
        ) : item.isApprovedByManager === 'rejected' ||
          item.isApprovedByOfficer === 'rejected' ? (
          <>
            <button className="action-btn W">
              <VscReport
                onClick={() => {
                  setName('Rejection');
                  setDescription(item.rejectMassage);
                  setTrigger(true);
                }}
              />
            </button>
          </>
        ) : (
          ''
        )}
      </td>
      <td>
        {item.DeliveryStatus === 'submitted' ? (
          <div
            onClick={() => {
              setName('GoodsReceipt');
              setId(item._id);
              setItemName(item.itemName);
              setTrigger(true);
            }}
          >
            <Badge type="normal" content="view" />
          </div>
        ) : (
          ''
        )}
      </td>
    </tr>
  );

  return (
    <div>
      <Sidebar />
      <div id="main" className="layout__content">
        <TopNav />
        <div className="layout__content-main">
          <h1 className="page-header">CTSE Module Assignments</h1>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="flex">
                  <h2 className="request-title">Asignment 01</h2>
                </div>
                <br />
                <h3>
                  Analyze the case study given below and draw a usecase diagram.
                </h3>
                <br />
                <p>
                  “GlamourFashions (GF)” is a clothing store situated in Colombo
                  and it’s planning to build an online shopping system to
                  promote their sales further. The management of clothing store
                  hired you as a System Analyst and asked to come up with the
                  design models for GlamourFashions Online Store (GFOS).
                  GlamourFashions (GF) Online Clothing Store is expected to
                  organize clothing items under several categories like office
                  wear, casual wear, evening wear and so on. A visitor can
                  browse on items without being registering to the system. If
                  he/she likes to order item, the system facilitates to add
                  selected items into the shopping cart and directly move to
                  checkout option. If the user interested to be a regular user,
                  the system will provide “registration” facility as well.
                  Without even registering, the user can directly go for the
                  “checkout”. For a registered user, the system is expected to
                  send a promotion code for users’ mobile every month which can
                  be used only once. when the user logs into the system to do
                  online shopping, user can enter this code which will give a 5%
                  discount for the order he/she makes. If the user does not use
                  the code within the month, automatically the system must
                  “discard promotion code”. If it’s been already used, the
                  system must display a message saying “it’s already been used”.
                  After adding the items into a shopping cart, user can select
                  the checkout button which gives two payment options, Cash on
                  Delivery or Pay by Card. Once the user goes to the payment
                  option, the system will display details about the order the
                  customer has made. It will display the order number, each item
                  details with an image of clothing item, total amount to be
                  paid. If any item needs to be removed from the current order
                  system will facilitate it as well. Finally, the system will
                  ask user to enter delivery details including any comments
                  which is optional. Based on the location to be delivered it
                  will indicate the delivery cost and final amount to be paid
                  for the order. The according to user preferences, Cash on
                  Delivery or Pay by Card can be selected. If the user provides
                  credit or debit card details, card information will be
                  verified using a payment gateway.
                </p>
              </div>
            </div>
          </div>
          <div className="row ">
            <div className="col-12">
              <div className="card">
                <div className="row ">
                  <div className="col-6">
                    <div className="row-user">
                      <input
                        style={{ float: 'right' }}
                        accept=".png, .jpg, .jpeg"
                        type="file"
                        onChange={fileHandler}
                        required
                      />
                    </div>
                  </div>
                  <div className="row-user">
                    <button type="submit" onClick={upload}>
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSubjectAssingment;
