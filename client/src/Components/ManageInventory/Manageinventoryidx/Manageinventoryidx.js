import React from "react";
import './Manageinventoryidx.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import Feebanner from "../../../Assets/Inventory Mana.png";
import InventoryList from "../../../Assets/inventory list.png";
import InventoryReport from "../../../Assets/Inventory report.png";
import addInventory from "../../../Assets/addInventory.png";
import viewInventory from "../../../Assets/view inventory.png";

function Manageinventoryidx(){
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className="managefee_banner">
                            <img src={Feebanner} alt="banner"></img>
                            {/* <div className="managefee_text-overlay">Inventory Management</div> */}
                        </div>
                        <div className="managefee_con">
                            <div className="managefee_feefeature">
                                <div className="managefee_image">
                                    <img src={addInventory} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Add Inventory Item</h5>
                                </div>
                            </div>

                            <div className="managefee_feefeature">
                                <div className="managefee_image">
                                    <img src={viewInventory} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>View Inventory</h5>
                                </div>
                            </div>

                            <div className="managefee_feefeature" >
                                <div className="managefee_image">
                                    <img src={InventoryList} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Purchase Orders</h5>
                                </div>
                            </div>
                        
                            <div className="managefee_feefeature" >
                                <div className="managefee_image">
                                    <img src={InventoryReport} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Reports</h5>
                                </div>
                            </div>

                            

                            
                        </div>

                        {/* your code ends here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Manageinventoryidx;