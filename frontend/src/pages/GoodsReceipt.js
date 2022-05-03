import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Spinner from '../components/loading/Spinner';

const GoodsReceipt = ({id,item}) => {

    const [Report, setReport] = useState({})
	const [Loading, setLoading] = useState(false);
    const [GoodsReport, setGoodsReport] = useState({
            agreed:false,
            item:"",
            supplier:"",
            description:"",
            quantity:"",
            date:new Date().toLocaleDateString(),
            review:""
    })


    const goodsReportHandler = async(e)=>{
            e.preventDefault();
            console.log(Report);
            try{

			const resReport= await axios.post(`/reports/goodsreport`, Report);
			
            console.log(resReport.data.reports);
			if(resReport.statusText === "OK" ){
				
          
			}
        }catch(Err){
            console.log(Err.response);
        }
    }
    const FetchData = async () => {
        try{
			const resReport= await axios.get(`/reports/deliveryreport/${id}`);
			setReport(resReport.data);
            console.log(resReport.data);
			if(resReport.statusText === "OK" ){
				setLoading(true)
                
			}
        }catch(Err){
            console.log(Err.response);
        }
		};

    useEffect(() => {
        FetchData()
        
    }, [])
    return  (
        <div style={{ width: "700px", height: "400px" }} >
            <div>
                    <h1 className="S " style={{position:'relative', top:"-80px", fontSize:40, display: "flex",
												justifyContent: "center", alignItems: "center",width: "100%",
												}}>Goods Receipt</h1>
                    {Loading ? (<form onSubmit={goodsReportHandler}>
                    <div className="row " >
                        <div className="col-12">
                            <div className="col-3">
                                <h4>Item Name</h4>
                            </div>
                            <div className="col-3">
                                <h4>{Report.item}</h4>
                            </div>
                            <div className="col-3">
                                <h4>Quantity</h4>
                            </div>
                            <div className="col-3">
                                <h4>{Report.quantity}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row " >
                        <div className="col-12">
                            <div className="col-3">
                                <h4>Supplier</h4>
                            </div>
                            <div className="col-3">
                                <h4>{Report.supplierId.name}</h4>
                            </div>
                            <div className="col-3">
                                <h4>Delivery Date</h4>
                            </div>
                            <div className="col-3">
                                <h4>{new Date().toLocaleDateString()}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row " >
                        <div className="col-12">
                            <div className="col-3">
                                <h4>Description</h4>
                            </div>
                            <div className="col-9">
                                <h4>{Report.description}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row " >
                    <div className="row-user" style={{display:'inline',paddingTop: "20px", marginLeft:"28px"}} >
										
						<input type="checkbox" onChange={(e)=>{setReport({ ...Report, agreed:!GoodsReport.agreed})
						console.log(GoodsReport.agreed);}} style={{width:17, height:17, display:'inline'}} />
						<h5 style={{ marginLeft:12,display:'inline'}}>You agreed with this delivery</h5>
					</div>
                    </div>
                    <div className="row "  style={{marginTop:"10px"}}>
                        <div className="col-12">
                            <div className="col-2">
                                <h4 style={{marginTop:"25px"}}>Review</h4>
                            </div>
                            <div className="col-10">
                                <div className="row-user">
                                    <input  required onChange={(e)=>{setReport({...Report, review: e.target.value})}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ paddingTop: 10 }}>
									<div className="row ">
										<div
											style={{
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												width: "100%",
											}}
										>
											<div className="row-user">
												<button type="submit " >
													submit
												</button>
											</div>
										</div>
									</div>
								</div>
                                </form>):<Spinner/>}
            </div>
        </div>
    
    )
                                        }

export default GoodsReceipt
