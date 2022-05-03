import React from 'react'

const Rejection = ({description}) => {
    return (
        <div style={{ width: "400px", height: "200px" }} >
            <div>
                    <h1 className="S" style={{position:'relative', top:"-80px", fontSize:40, display: "flex",
												justifyContent: "center", alignItems: "center",width: "100%",
												}}>Reason to reject</h1>
                    <div className="row " >
                        <div className="col-12">
                    <h3>{description}</h3>
                    </div>
                    </div>
            </div>
        </div>
    )
}

export default Rejection
