import time
import requests
from datetime import datetime
from typing import Any, List

from random import randint

from app import crud, models, schemas
from app.api import deps
from app.constants.role import Role
from fastapi import APIRouter, Body, Depends, HTTPException, Security
from sqlalchemy.orm import Session

router = APIRouter(prefix="/networks", tags=["networks"])


@router.get("/cn_details")
def get_CN_details(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Security(deps.get_current_active_user),
) -> Any:
    """
    Get CN details
    """
    if not current_user.account_id:
        raise HTTPException(status_code=404, detail="Account not found")
    
    latest_ap_device = crud.account_access_point.get_latest_by_account_id(db, account_id=current_user.account_id)
    print(latest_ap_device)
    
    if not latest_ap_device:
        raise HTTPException(status_code=404, detail="No AP devices found")
    
    ap_device = latest_ap_device.access_point.name.lower()
    print(ap_device)
    
    items = []
    
    if ap_device == "ors17-nr":
        items = [
        {
            "id": "check-interface-up",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor/promise/check-interface-up.log"
        },
        {
            "id": "check-free-disk-space",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor/promise/check-free-disk-space.log"
        },
        {
            "id": "buildout-slappart2-status",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor/promise/buildout-slappart2-status.log"
        },
        {
            "id": "monitor-bootstrap-status",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor/promise/monitor-bootstrap-status.log",
        },
        {
            "id": "monitor-http-frontend",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor/promise/monitor-http-frontend.log",
        },
        {
            "id": "monitor-httpd-listening-on-tcp",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor/promise/monitor-httpd-listening-on-tcp.log",
        }
    ]
    
    elif ap_device == "ors58-nr":
        items = [
        {
            "id": "check-interface-up",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/check-interface-up.log"
        },
        {
            "id": "check-free-disk-space",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/check-free-disk-space.log"
        },
        {
            "id": "buildout-slappart15-status",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/buildout-slappart15-status.log"
        },
        {
            "id": "monitor-bootstrap-status",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/monitor-bootstrap-status.log",
        },
        {
            "id": "monitor-http-frontend",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/monitor-http-frontend.log",
        },
        {
            "id": "monitor-httpd-listening-on-tcp",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/monitor-httpd-listening-on-tcp.log",
        }
    ]
        
    
    responses = []
    results = []
    
    for item in items:
        try:
            response = read_from_url(item['url'])
            
            result = [x.strip() for x in response.split('-')]
            
            info = {}
            info['description'] = item['id']
            info['time'] = "-".join(result[:3])
            info['status'] = result[3]
            info['message'] = "-".join(result[6:])
            results.append(info)
            
            result_dict = {}
            result_dict['description'] = item['id']
            result_dict['message'] = "-".join(result[6:])
            responses.append(result_dict)
        except Exception as e:
            print(e)
            result_dict = {}
            result_dict['description'] = item['id']
            result_dict['message'] =  "Error Occured"
            responses.append(result_dict)

    # Loop over each object and check its status
    for obj in results:
        if obj['status'] == 'ERROR':
            print(f"Found error in {obj['name']} - {obj['message']}")
            # Do something if an error is found
            raise HTTPException(status_code=404, detail=obj['message'])
            break
        else:
            print("No errors found")
            # Do something if no errors are found
        
    return { 
            "count": 1, 
            "device": 1, 
            "message": responses 
        }


@router.get("/ran_details")
def get_RAN_details(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Security(deps.get_current_active_user),
) -> Any:
    """
    Get RAN details
    """
    if not current_user.account_id:
        raise HTTPException(status_code=404, detail="Account not found")
    
    latest_ap_device = crud.account_access_point.get_latest_by_account_id(db, account_id=current_user.account_id)
    print(latest_ap_device)
    
    if not latest_ap_device:
        raise HTTPException(status_code=404, detail="No AP devices found")
    
    ap_device = latest_ap_device.access_point.name.lower()
    print(ap_device)
    
    items = []
    
    device = "5-Fi 17"
    
    if ap_device == "ors17-nr":
        device = "5-Fi 17"
        items = [
            {
                "id": "buildout-slappart8-status",
                "url":  "https://admin:yvsIBNgxFWy38gVt@softinst182366.host.vifib.net/share/private/log/monitor/promise/buildout-slappart8-status.log",
            },
            {
                "id": "check-amarisoft-stats-log",
                "url": "https://admin:yvsIBNgxFWy38gVt@softinst182366.host.vifib.net/share/private/log/monitor/promise/check-amarisoft-stats-log.log",
            },
            {
                "id": "check-baseband-latency",
                "url": "https://admin:yvsIBNgxFWy38gVt@softinst182366.host.vifib.net/share/private/log/monitor/promise/check-baseband-latency.log",
            },
            {
                "id": "check-free-disk-space",
                "url": "https://admin:yvsIBNgxFWy38gVt@softinst182366.host.vifib.net/share/private/log/monitor/promise/check-free-disk-space.log",
            },
            {
                "id": "check-rx-saturated",
                "url": "https://admin:yvsIBNgxFWy38gVt@softinst182366.host.vifib.net/share/private/log/monitor/promise/check-rx-saturated.log",
            },
            {
                "id": "check-sdr-busy",
                "url": "https://admin:yvsIBNgxFWy38gVt@softinst182366.host.vifib.net/share/private/log/monitor/promise/check-sdr-busy.log", 
            },
            {
                "id": "monitor-bootstrap-status",
                "url": "https://admin:yvsIBNgxFWy38gVt@softinst182366.host.vifib.net/share/private/log/monitor/promise/monitor-bootstrap-status.log",
            },
            {
                "id": "monitor-http-frontend",
                "url": "https://admin:yvsIBNgxFWy38gVt@softinst182366.host.vifib.net/share/private/log/monitor/promise/monitor-http-frontend.log",
            },
            {
                "id": "monitor-httpd-listening-on-tcp",
                "url": "https://admin:yvsIBNgxFWy38gVt@softinst182366.host.vifib.net/share/private/log/monitor/promise/monitor-httpd-listening-on-tcp.log",
            }
        ]
    
    elif ap_device == "ors58-nr":
        device = "5-Fi 58"
        items = [
            {
                "id": "buildout-slappart0-status",
                "url":  "https://admin:dWi5B8oy6FEzuoH3@softinst182358.host.vifib.net/share/private/log/monitor/promise/buildout-slappart0-status.log",
            },
            {
                "id": "check-amarisoft-stats-log",
                "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182358.host.vifib.net/share/private/log/monitor/promise/check-amarisoft-stats-log.log",
            },
            {
                "id": "check-baseband-latency",
                "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182358.host.vifib.net/share/private/log/monitor/promise/check-baseband-latency.log",
            },
            {
                "id": "check-free-disk-space",
                "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182358.host.vifib.net/share/private/log/monitor/promise/check-free-disk-space.log",
            },
            {
                "id": "check-rx-saturated",
                "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182358.host.vifib.net/share/private/log/monitor/promise/check-rx-saturated.log",
            },
            {
                "id": "check-sdr-busy",
                "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182358.host.vifib.net/share/private/log/monitor/promise/check-sdr-busy.log", 
            },
            {
                "id": "monitor-bootstrap-status",
                "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182358.host.vifib.net/share/private/log/monitor/promise/monitor-bootstrap-status.log",
            },
            {
                "id": "monitor-http-frontend",
                "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182358.host.vifib.net/share/private/log/monitor/promise/monitor-http-frontend.log",
            },
            {
                "id": "monitor-httpd-listening-on-tcp",
                "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182358.host.vifib.net/share/private/log/monitor/promise/monitor-httpd-listening-on-tcp.log",
            }
        ]
    
    responses = []
    results = []
    
    for item in items:
        try:
            response = read_from_url(item['url'])
            
            result = [x.strip() for x in response.split('-')]
            
            info = {}
            info['description'] = item['id']
            info['time'] = "-".join(result[:3])
            info['status'] = result[3]
            info['message'] = "-".join(result[6:])
            results.append(info)
            
            result_dict = {}
            result_dict['description'] = item['id']
            result_dict['message'] = "-".join(result[6:])
            responses.append(result_dict)
        except Exception as e:
            print(e)
            result_dict = {}
            result_dict['description'] = item['id']
            result_dict['message'] =  "Error Occured"
            responses.append(result_dict)


    # Loop over each object and check its status
    for obj in results:
        if obj['status'] == 'ERROR':
            print(f"Found error in {obj['name']} - {obj['message']}")
            # Do something if an error is found
            raise HTTPException(status_code=404, detail=obj['message'])
            break
        else:
            print("No errors found")
            # Do something if no errors are found


    return { 
            "count": 1, 
            "device": { "name": device, "count": 1}, 
            "message": responses 
        }


@router.get("/cn_monitor_log")
def get_CN_monitor_log(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Security(deps.get_current_active_user),
) -> Any:
    """
    Get CN monitor log
    """
    if not current_user.account_id:
        raise HTTPException(status_code=404, detail="Account not found")
    
    latest_ap_device = crud.account_access_point.get_latest_by_account_id(db, account_id=current_user.account_id)
    print(latest_ap_device)
    
    if not latest_ap_device:
        raise HTTPException(status_code=404, detail="No AP devices found")
    
    ap_device = latest_ap_device.access_point.name.lower()
    print(ap_device)
    
    # ap_device = "ors17-nr"
    
    items = []
    
    if ap_device == "ors17-nr":
        items = [
        {
            "id": "check-interface-up",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor/promise/check-interface-up.log"
        },
        {
            "id": "check-free-disk-space",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor/promise/check-free-disk-space.log"
        },
        {
            "id": "buildout-slappart2-status",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor/promise/buildout-slappart2-status.log"
        },
        {
            "id": "monitor-bootstrap-status",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor/promise/monitor-bootstrap-status.log",
        },
        {
            "id": "monitor-http-frontend",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor/promise/monitor-http-frontend.log",
        },
        {
            "id": "monitor-httpd-listening-on-tcp",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor/promise/monitor-httpd-listening-on-tcp.log",
        },
        {
            "id": "monitor-httpd-error",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor-httpd-error.log"
        }
    ]
    
    elif ap_device == "ors58-nr":
        items = [
        {
            "id": "check-interface-up",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/check-interface-up.log"
        },
        {
            "id": "check-free-disk-space",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/check-free-disk-space.log"
        },
        {
            "id": "buildout-slappart15-status",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/buildout-slappart15-status.log"
        },
        {
            "id": "monitor-bootstrap-status",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/monitor-bootstrap-status.log",
        },
        {
            "id": "monitor-http-frontend",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/monitor-http-frontend.log",
        },
        {
            "id": "monitor-httpd-listening-on-tcp",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/monitor-httpd-listening-on-tcp.log",
        },
        {
            "id": "monitor-httpd-error",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor-httpd-error.log"
        }
    ]
        
    
    responses = []
    results = []
    
    for item in items:
        if item['id'] == 'monitor-httpd-error':
            try:
                response = read_from_url(item['url'])
                result = [x.strip() for x in response.split(":")]
                
                rslt = [x.strip() for x in result[4].split()]
                print(rslt)
                
                result_dict = {}
                result_dict['description'] = item['id']
                result_dict['switch'] = rslt[2]
                result_dict['message'] = result[5]
                num1 = f"{latest_ap_device.id:03d}"
                num2 = f"{latest_ap_device.ap_id:03d}"
                
                result_dict['ap_id'] = num1 + num2
                responses.append(result_dict)
            except Exception as e:
                print(e)
                result_dict = {}
                result_dict['description'] = item['id']
                result_dict['message'] =  "Error Occured"
                responses.append(result_dict)
        else:
            try:
                response = read_from_url(item['url'])
                
                result = [x.strip() for x in response.split('-')]
                print(result)
                
                info = {}
                info['description'] = item['id']
                info['time'] = "-".join(result[:3])
                info['status'] = result[3]
                info['message'] = "-".join(result[6:])
                results.append(info)
                
                result_dict = {}
                result_dict['description'] = item['id']
                result_dict['message'] = "-".join(result[6:])
                num1 = f"{latest_ap_device.id:03d}"
                num2 = f"{latest_ap_device.ap_id:03d}"
                
                result_dict['ap_id'] = num1 + num2
                responses.append(result_dict)
            except Exception as e:
                print(e)
                result_dict = {}
                result_dict['description'] = item['id']
                result_dict['message'] =  "Error Occured"
                responses.append(result_dict)
        
    return { "message": responses }


@router.get("/ran_monitor_log")
def get_RAN_monitor_log(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Security(deps.get_current_active_user),
) -> Any:
    """
    Get RAN monitor log
    """
    if not current_user.account_id:
        raise HTTPException(status_code=404, detail="Account not found")
    
    latest_ap_device = crud.account_access_point.get_latest_by_account_id(db, account_id=current_user.account_id)
    print(latest_ap_device)
    
    if not latest_ap_device:
        raise HTTPException(status_code=404, detail="No AP devices found")
    
    ap_device = latest_ap_device.access_point.name.lower()
    print(ap_device)
    
    # ap_device = "ors17-nr"
    
    items = []
    
    if ap_device == "ors17-nr":
        items = [
        {
            "id": "check-interface-up",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor/promise/check-interface-up.log"
        },
        {
            "id": "check-free-disk-space",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor/promise/check-free-disk-space.log"
        },
        {
            "id": "buildout-slappart2-status",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor/promise/buildout-slappart2-status.log"
        },
        {
            "id": "monitor-bootstrap-status",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor/promise/monitor-bootstrap-status.log",
        },
        {
            "id": "monitor-http-frontend",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor/promise/monitor-http-frontend.log",
        },
        {
            "id": "monitor-httpd-listening-on-tcp",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor/promise/monitor-httpd-listening-on-tcp.log",
        },
        {
            "id": "monitor-httpd-error",
            "url": "https://admin:yvsIBNgxFWy38gVt@softinst182367.host.vifib.net/share/private/log/monitor-httpd-error.log"
        }
    ]
    
    elif ap_device == "ors58-nr":
        items = [
        {
            "id": "check-interface-up",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/check-interface-up.log"
        },
        {
            "id": "check-free-disk-space",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/check-free-disk-space.log"
        },
        {
            "id": "buildout-slappart15-status",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/buildout-slappart15-status.log"
        },
        {
            "id": "monitor-bootstrap-status",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/monitor-bootstrap-status.log",
        },
        {
            "id": "monitor-http-frontend",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/monitor-http-frontend.log",
        },
        {
            "id": "monitor-httpd-listening-on-tcp",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/monitor-httpd-listening-on-tcp.log",
        },
        {
            "id": "monitor-httpd-error",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor-httpd-error.log"
        }
    ]
        
    
    responses = []
    results = []
    
    for item in items:
        if item['id'] == 'monitor-httpd-error':
            try:
                response = read_from_url(item['url'])
                result = [x.strip() for x in response.split(":")]

                rslt = [x.strip() for x in result[4].split()]
                
                result_dict = {}
                result_dict['description'] = item['id']
                result_dict['switch'] = rslt[2]
                result_dict['message'] = result[5]
                num1 = f"{latest_ap_device.id:03d}"
                num2 = f"{latest_ap_device.ap_id:03d}"
                
                result_dict['ap_id'] = num1 + num2
                responses.append(result_dict)
            except Exception as e:
                print(e)
                result_dict = {}
                result_dict['description'] = item['id']
                result_dict['message'] = "Error Occured"
                responses.append(result_dict)
        else:
            try:
                response = read_from_url(item['url'])
                
                result = [x.strip() for x in response.split('-')]
                print(result)
                print(len(result))
                
                info = {}
                info['description'] = item['id']
                info['time'] = "-".join(result[:3])
                info['status'] = result[3]
                info['message'] = "-".join(result[6:])
                results.append(info)
                
                result_dict = {}
                result_dict['description'] = item['id']
                result_dict['message'] = "-".join(result[6:])
                num1 = f"{latest_ap_device.id:03d}"
                num2 = f"{latest_ap_device.ap_id:03d}"
                
                result_dict['ap_id'] = num1 + num2
                responses.append(result_dict)
            except Exception as e:
                print(e)
                result_dict = {}
                result_dict['description'] = item['id']
                result_dict['message'] =  "Error Occured"
                responses.append(result_dict)
        
        
    return { "message": responses }

@router.get('/get_network_stats/')
def get_network_stats():
    
    data = []
    
    series = ['2022-06-01', '2022-06-02', '2022-06-03', '2022-06-04',
               '2022-06-05', '2022-06-06', '2022-06-07', '2022-06-08',
               '2022-06-09', '2022-06-10', '2022-06-11', '2022-06-12',
               '2022-06-13', '2022-06-14', '2022-06-15', '2022-06-16',
               '2022-06-17', '2022-06-18', '2022-06-19', '2022-06-20',
               '2022-06-21', '2022-06-22', '2022-06-23', '2022-06-24',
               '2022-06-25', '2022-06-26', '2022-06-27', '2022-06-28',
               '2022-06-29', '2022-06-30']
               #pd.date_range(start='2022-06-01', end='2022-06-30', freq='D')
    #print(series)
    x=series
    #for time in series:    
    #    x.append(pd.date_range(time, freq='D', periods=1).strftime("%Y-%m-%d").tolist())
    #a = pd.to_datetime(series['DatetimeIndex']).dt.date.unique().tolist()
    #random.seed(43)
    y =[]
    for i in range(len(x)):
        y.append(randint(0,100))

    b = {}
    a =[]
    for i in range(len(x)):
        #random.seed(1)
        b['x'] = x[i]
        b['y'] = y[i]
        a.append(b.copy())

    #a = random.randint(0, 100, size=(len(x)))
    #b= a.tolist() 
    data_dict = {
        "title": "Successful Connects",
        "value": "80%",
        "data": a
    }
    data.append(data_dict)
    #Plot_Stat["ySuccessful"] = a
    #a = random.randint(50, 200, size=(len(x)))
    #b= a.tolist() 
    
    y =[]
    for i in range(len(x)):
        y.append(randint(50,200))
    
    b = {}
    a =[]
    for i in range(len(x)):
        b['x'] = x[i]
        b['y'] = y[i]
        a.append(b.copy())
        
    
    data_dict = {
        "title": "Throughput",
        "value": "31.2 Mbps",
        "data": a
    }
    data.append(data_dict)

    y =[]
    for i in range(len(x)):
        y.append(randint(10,15))
    
    b = {}
    a =[]
    for i in range(len(x)):
        b['x'] = x[i]
        b['y'] = y[i]
        a.append(b.copy())
    
    
    data_dict = {
        "title": "Latency",
        "value": "13ms",
        "data": a
    }
    data.append(data_dict)
    
    y =[]
    for i in range(len(x)):
        y.append(randint(10,25))
    
    b = {}
    a =[]
    for i in range(len(x)):
        b['x'] = x[i]
        b['y'] = y[i]
        a.append(b.copy())
    
    data_dict = {
        "title": "Packet Loss",
        "value": "13%",
        "data": a
    }
    data.append(data_dict)

    
    y =[]
    for i in range(len(x)):
        y.append(randint(50,100))
    
    b = {}
    a =[]
    for i in range(len(x)):
        b['x'] = x[i]
        b['y'] = y[i]
        a.append(b.copy())
    
    data_dict = {
        "title": "Mobility",
        "value": "80%",
        "data": a
    }
    data.append(data_dict)
    
    return data

def read_from_url(url, stream=False):
    response = requests.get(url, stream=stream)
    
    if response.status_code == 200:
        if stream:
            dict = []
            for line in response.iter_lines():
                if line:
                    # do something with the line
                    print(line)
                    dict.append(line)
            return dict
        else:
            # Split the response content into lines and get the last line
            lines = response.content.strip().split(b'\n')
            last_line = lines[-1].decode()
            # do something with the last line
            print(last_line)
            return last_line
    else:
        print(f'Failed to read file from URL: {url}')
        raise Exception(f'Failed to read file from URL: {url}')
    
    

def write_var_to_file(config_file: str, variable_name: str, variable_content: str) -> None:
    from typing import TextIO, List
    
    urls: TextIO = open(config_file, 'r')
    lines: List = urls.readlines()  # read all the lines of txt
    urls.close()

    for index, line in enumerate(lines):  # iterate over each line
        line_split: List[str] = line.split('=')
        var_name: str = line_split[0].strip()  # use strip() to remove empty space
        if var_name == variable_name:
            var_value: str = variable_content + "\n"#+ ";\n"
            line: str = F"{var_name} = {var_value}"

        lines[index] = line

    with open(config_file, 'w') as urls:
        urls.writelines(lines)  # save all the lines

    return {F"{var_name} = {var_value}"}