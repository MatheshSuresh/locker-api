import { useEffect, useState } from 'react';
import { Icon } from "@iconify/react";
import "./adminctrl.css"
import Sidebar from '../../components/sidebar';
import useAdminCtrlForm from "./useAdminCtrlForm";
import validateInfo from './validate';
import axios from "axios";

const AdminCtrl = () => {
    const [locker, setLocker] = useState("");
    const [Dashboarddata, setDashboarddata] = useState("");
    const [userdata, setUserdata] = useState([]);
    const [editdata, seteditdata] = useState([]);
    const [DashboardInfo, setDashboardInfo] = useState(Dashboarddata);
    const { values, handleChange, handleSubmit, errors } = useAdminCtrlForm(validateInfo);


    const getInfo = async () => {
        try {
            const { data } = await axios.get('http://3.239.93.89:3001/locker/lockerdata');
            const users = await axios.get('http://3.239.93.89:3001/user/check');
            setUserdata(users.data)
            setDashboarddata(data);
        } catch (err) {
            console.log(err);
        }
    }


    const unlock = async () => {
        // await axios.post("http://3.239.93.89:3001/locker/unlock", DashboardInfo[0]);
        console.log(locker);
        //124.123.67.202:8084/
        let set = await axios.get(`http://3.239.93.89:3001/openLock/?ip=124.123.67.202&port=8084&type=operate&address=${locker}`);
        console.log(set)
    }
 
    const unlockAll = async () => {
     
        await axios.get(`http://3.239.93.89:3001/openLockAll/?ip=124.123.67.202&port=8084`);
  
    }

    useEffect(() => {
        getInfo();
    }, []);

    const addlocker = async () => {
        var lockername = document.getElementById("lockername").value
        var status = document.getElementById("status").value
        var subtopic = document.getElementById("subtopic").value
        var pubtopic = document.getElementById("pubtopic").value
        var key = document.getElementById("key").value
        var user = document.getElementById("user").value
        var data = {
            name: lockername,
            ip_address: status,
            port_address: subtopic,
            locker_address: pubtopic,
            key: key,
            user: user
        }
        var addlockerdata = await axios.post(`http://3.239.93.89:3001/locker/insertlocker`, data).then((res) => { return res.data })
        if (addlockerdata !== null) {
            window.location.reload()
        }
    }
    const handleChangelockername = async (e) => {
        var singledata = await Dashboarddata.filter((data) => { return data.name === e.target.value })
        seteditdata(singledata)
        document.getElementById("lockernameedit").value = singledata[0].name
        document.getElementById("statusedit").value = singledata[0].ip_address
        document.getElementById("subtopicedit").value = singledata[0].port_address
        document.getElementById("pubtopicedit").value = singledata[0].locker_address
        document.getElementById("keyedit").value = singledata[0].key
        // document.getElementById("useredit").innerHTML = `<option value="${singledata[0].user}">${singledata[0].user}</option>`
    }
    const editlocker = async () => {
        var lockername = document.getElementById("lockernameedit").value
        var status = document.getElementById("statusedit").value
        var subtopic = document.getElementById("subtopicedit").value
        var pubtopic = document.getElementById("pubtopicedit").value
        var key = document.getElementById("keyedit").value
        // var user = document.getElementById("useredit").value
        var data = {
            name: lockername,
            ip_address: status,
            port_address: subtopic,
            locker_address: pubtopic,
            key: key,
            // user: user
        }
        var addlockerdata = await axios.post(`http://3.239.93.89:3001/locker/updatealldata`, data).then((res) => { return res.data })
        if (addlockerdata !== null) {
            window.location.reload()
        }
    }
    const Deletelocker=async()=>{
        var data={
            name :editdata[0].name
        }
        console.log(data)
        var addlockerdata = await axios.post(`http://3.239.93.89:3001/locker/deletedata`, data).then((res) => { return res.data })
        if (addlockerdata !== null) {
            window.location.reload()
        }
    }
    return (
        <div className='adminCtrl'>
            <Sidebar className="adminCtrl_Sidebar" />
            <div className="adminCtrl_Rightbar">
                <div className="adminCtrl_RightbarTop">
                    <Icon icon="carbon:user-settings" className='adminCtrl_Icon' />
                    <h3 className='adminCtrl_Heading'>Super Admin</h3>
                    <form>
                        <div className='adminCtrl_search_Input'>
                            <input
                                className='adminCtrl_search_Inputfields'
                                placeholder='Search'
                                name='username'
                                type="text"
                            >
                            </input>
                        </div>
                    </form>
                </div>
                <div className="adminCtrl_RightbarBottom">
                    <div className="adminCtrl_RightbarBottomleft" >
                        <div className="adminCtrl_lockerContainer">
                            <div className='adminCtrl_lockerContainertop'>
                                <h6>Employee List</h6>
                                <form>
                                    <div className='adminCtrl_lockerContainer2_search_Input'>
                                        <input
                                            className='adminCtrl_lockerContainer2_search_Inputfields'
                                            placeholder='Search'
                                            name='username'
                                            type="text"
                                        >
                                        </input>
                                        <label htmlFor='username' className='adminCtrl_lockerContainer2_search_Icon'>
                                            <Icon icon="charm:search" />
                                        </label>
                                    </div>
                                </form>
                            </div>

                            <hr />
                            <div className='adminctrl_databoard'>
                                <div className='adminctrl_databoard_top'>
                                    <label className="adminctrl_label">Open Selected Locker</label>
                                    <select onChange={(e) => {
                                        const lock = e.target.value;
                                        setLocker(lock);
                                        console.log(locker);
                                        // setDashboardInfo(
                                        //     Dashboarddata.filter((item) =>
                                        //         item.name.toLowerCase().match(locker.toLowerCase())));
                                        // console.log(DashboardInfo[0]);
                                    }}>
                                         <option>Select Locker</option>
                                        {(() => {
                                            if (Dashboarddata.length !== 0) {
                                                return (
                                                    <>
                                                        {Dashboarddata.map((values, key) => {
                                                            return <option className="adminctrl_option" key={key} value={values.locker_address}>{values.name}</option>
                                                        })}
                                                    </>
                                                )
                                            }
                                        })()}
                                    </select>
                                    <button className="adminctrl_Button" type='submit' onClick={unlock}>Open</button>
                                </div>
                                <br />
                                <div className='adminctrl_databoard_bottom'>
                                    <label className="adminctrl_label">Open All Locker</label>
                                    <button type="button" className="adminctrl_Button" onClick={unlockAll}>Open</button>
                                </div>
                            </div>
                        </div>
                        <div className="adminCtrl_lockerInfoContainer">
                            <div className='adminCtrl_lockerInfo2new '>
                                <h3>Edit Locker</h3>
                                <div className='adminCtrl_lockerInfo2_Form' >
                                    <label htmlFor="">Select Locker</label>
                                    <select className='adminCtrl_lockerInfo_Input' onChange={handleChangelockername}>
                                        <option>Select Locker</option>
                                        {Dashboarddata.length !== 0 ? Dashboarddata.map((data, index) => (
                                            <option key={index} value={data.name}>{data.name}</option>
                                        )) : null}
                                    </select>
                                    <label htmlFor="">Locker Name</label>
                                    <input
                                        name="name"
                                        id='lockernameedit'
                                        type="text"
                                        className='adminCtrl_lockerInfo_Input'
                                        disabled
                                    />
                                    {errors.name && <p>{errors.name}</p>}
                                    
                                    <label htmlFor="">IP Address</label>
                                    <input
                                        id='statusedit'
                                        name="status"
                                        type="text"
                                        className='adminCtrl_lockerInfo_Input'

                                    />
                                    {errors.status && <p>{errors.status}</p>}
                                 
                                    <label htmlFor="">Port Address</label>
                                    <input
                                        id='subtopicedit'
                                        name="subscribe_topic"
                                        type="text"
                                        className='adminCtrl_lockerInfo_Input'

                                    />
                                    {errors.subscribe_topic && <p>{errors.subscribe_topic}</p>}
                                   
                                    <label htmlFor="">Locker Address</label>
                                    <input
                                        id='pubtopicedit'
                                        name="publish-topic"
                                        type="text"
                                        className='adminCtrl_lockerInfo_Input'
                                    />
                                    {errors.publish_topic && <p>{errors.publish_topic}</p>}
                                   
                                    <label htmlFor="">Message</label>
                                    <input
                                        id='keyedit'
                                        name="key"
                                        type="text"
                                        className='adminCtrl_lockerInfo_Input'
                                    />
                                    {errors.message && <p>{errors.message}</p>}
                                   
                                    {/* <label htmlFor="">Select User</label>
                                    <select className='adminCtrl_lockerInfo_Input' id='useredit' name="user" onChange={handleChange} >
                                        <option value="null">Select User</option>
                                        {userdata.map((data, index) => (
                                            <option className="adminctrl_option" value={data.email} key={index}>{data.email}</option>
                                        ))}
                                    </select> */}
                                   <div>
                                   <button className='adminCtrl_lockerInfo_Button' onClick={editlocker}>Edit Locker</button>
                                    <button className='adminCtrl_lockerInfo_Button' onClick={Deletelocker}>Delete Locker</button>
                                   </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="adminCtrl_lockerInfoContainer">
                        <div className='adminCtrl_lockerInfo2'>
                            <h3>Add Locker</h3>
                            <div className='adminCtrl_lockerInfo2_Form' >
                                <label htmlFor="">Locker Name</label>
                                <input
                                    name="name"
                                    id='lockername'
                                    type="text"
                                    className='adminCtrl_lockerInfo_Input'
                                    value={values.name}
                                    onChange={handleChange} />
                                {errors.name && <p>{errors.name}</p>}
                                <br />
                                <label htmlFor="">Ip Address</label>
                                <input
                                    id='status'
                                    name="status"
                                    type="text"
                                    className='adminCtrl_lockerInfo_Input'
                                    value={values.status}
                                    onChange={handleChange} />
                                {errors.status && <p>{errors.status}</p>}
                                <br />
                                <label htmlFor="">Port Address</label>
                                <input
                                    id='subtopic'
                                    name="subscribe_topic"
                                    type="number"
                                    className='adminCtrl_lockerInfo_Input'
                                    value={values.subscribe_topic}
                                    onChange={handleChange} />
                                {errors.subscribe_topic && <p>{errors.subscribe_topic}</p>}
                                <br />
                                <label htmlFor="">Locker Address</label>
                                <input
                                    id='pubtopic'
                                    name="publish-topic"
                                    type="number"
                                    className='adminCtrl_lockerInfo_Input'

                                    onChange={handleChange} />
                                {errors.publish_topic && <p>{errors.publish_topic}</p>}
                                <br />
                                <label htmlFor="">Message</label>
                                <input
                                    id='key'
                                    name="key"
                                    type="text"
                                    className='adminCtrl_lockerInfo_Input'
                                    value={values.key}
                                    onChange={handleChange} />
                                {errors.message && <p>{errors.message}</p>}
                                <br />
                                <label htmlFor="">Select User</label>
                                <select className='adminCtrl_lockerInfo_Input' id='user' name="user" onChange={handleChange} >
                                    <option value="null">Select User</option>
                                    {userdata.map((data, index) => (
                                        <option className="adminctrl_option" value={data.email} key={index}>{data.email}</option>
                                    ))}

                                </select>
                                <button className='adminCtrl_lockerInfo_Button' onClick={addlocker}>Add Locker</button>
                              
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default AdminCtrl;
