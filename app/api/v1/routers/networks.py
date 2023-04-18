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
) -> Any:
    """
    Get CN details
    """
    items = [
        {
            "id": "buildout-slappart0-status",
            "url":  "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/buildout-slappart0-status.log"
        },
        {
            "id": "check-amarisoft-stats-log",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182359.host.vifib.net/share/private/log/monitor/promise/check-amarisoft-stats-log.log"
        },
        {
            "id": "check-baseband-latency",
            "url": "https://admin:dWi5B8oy6FEzuoH3@softinst182358.host.vifib.net/share/private/log/monitor/promise/check-baseband-latency.log",
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
    
    results = []
    
    for item in items:
        response = read_from_url(item['url'])
        
        result = {}
        result['description'] = item['id']
        result['message'] = response
        results.append(result)

    return results


@router.get("/ran_details")
def get_RAN_details(
    *,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get CN details
    """
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
    
    results = []
    
    for item in items:
        response = read_from_url(item['url'])
        
        result = {}
        result['description'] = item['id']
        result['message'] = response
        results.append(result)

    return results

def read_from_url(url):
    response = requests.get(url)
    
    

    if response.status_code == 200:
        # Split the response content into lines and get the last line
        lines = response.content.strip().split(b'\n')
        last_line = lines[-1].decode()
        # do something with the last line
        print(last_line)
        return last_line
    else:
        print(f'Failed to read file from URL: {url}')
        return f'Failed to read file from URL: {url}'
    
    

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