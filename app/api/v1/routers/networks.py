import time
import requests
from datetime import datetime
from typing import Any, List

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
    
    ap_devices = crud.account_access_point.list_by_account_id(db, account_id=current_user.account_id)
    
    if not ap_devices:
        raise HTTPException(status_code=404, detail="No AP devices found")
        
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
            
            result = [x.strip() for x in response.split(' - ')]
            
            info = {}
            info['description'] = item['id']
            info['time'] = result[0]
            info['status'] = result[1]
            info['message'] = result[3]
            results.append(info)
            
            result_dict = {}
            result_dict['description'] = item['id']
            result_dict['message'] = response
            responses.append(result_dict)
        except Exception as e:
            print(e)
            result_dict = {}
            result_dict['description'] = item['id']
            result_dict['message'] = e
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
        
    return { "count": 1, "message": responses }


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
    
    ap_devices = crud.account_access_point.list_by_account_id(db, account_id=current_user.account_id)
    
    if not ap_devices:
        raise HTTPException(status_code=404, detail="No AP devices found")
    
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
            
            result = [x.strip() for x in response.split(' - ')]
            
            info = {}
            info['description'] = item['id']
            info['time'] = result[0]
            info['status'] = result[1]
            info['message'] = result[3]
            results.append(info)
            
            result_dict = {}
            result_dict['description'] = item['id']
            result_dict['message'] = response
            responses.append(result_dict)
        except Exception as e:
            print(e)
            result_dict = {}
            result_dict['description'] = item['id']
            result_dict['message'] = e
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


    return { "count": 1, "message": responses }


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
    
    ap_devices = crud.account_access_point.list_by_account_id(db, account_id=current_user.account_id)
    
    if not ap_devices:
        raise HTTPException(status_code=404, detail="No AP devices found")
    
    url = "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor-httpd-error.log"
    
    response = {}
    
    try:
        response = read_from_url(url)
        result = [x.strip() for x in response.split(":")]
        response = {}
        rslt = [x.strip() for x in result[4].split()]
        print(rslt)
        # response['switch'] = rslt[4]
        response['message'] = result[5]
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail=e)

    return response


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
    
    ap_devices = crud.account_access_point.list_by_account_id(db, account_id=current_user.account_id)
    
    if not ap_devices:
        raise HTTPException(status_code=404, detail="No AP devices found")
    
    url = "https://admin:dWi5B8oy6FEzuoH3@softinst182358.host.vifib.net/share/private/log/monitor-httpd-error.log"
    
    response = {}
    
    try:
        response = read_from_url(url)
        result = [x.strip() for x in response.split(":")]
        print(result)
        response = {}
        rslt = [x.strip() for x in result[4].split()]
        print(rslt)
        # response['switch'] = rslt[4]
        response['message'] = result[5]
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail=e)
    
    account_ap = crud.account_access_point.get_by_account_id(db, account_id=current_user.account_id)
    
    
    num1 = f"{account_ap.id:03d}"
    num2 = f"{account_ap.ap_id:03d}"
    
    response['ap'] = num1 + num2    

    return response

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