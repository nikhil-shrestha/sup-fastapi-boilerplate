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
        response['switch'] = rslt[2]
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
        response['switch'] = rslt[2]
        response['message'] = result[5]
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail=e)
    
    account_ap = crud.account_access_point.get_by_account_id(db, account_id=current_user.account_id)
    
    
    num1 = f"{account_ap.id:03d}"
    num2 = f"{account_ap.ap_id:03d}"
    
    response['ap'] = num1 + num2    

    return response

@router.get('/get_network_stats/', tags=["Get Network Statistics"])
def get_network_stats():

    Net_Stat={
        "Successful Connects":[],
        "Throughput":[],
        "Latency":[],
        "Packet Loss":'13%',
        "Mobility":'80%',
    } 
    
    Plot_Stat = {
        "Successful":[],
        "Throughput":[],
        "Latency":[],
        "Packet Loss":[],
        "Mobility":[],
    }
    
    state= 'active'
    
    """ client=docker.from_env()
    container=client.containers.list(filters={"id":id})
    if len(container)==0:
        print ("no container running with given id")
        return    
    result = measurements.read()
    for row in result:
        Net_Stat["Successful Connects"] = '80%'
        measurements_data["time_stamp"]=row[3]
        measurements_data["dl_thp"]=row[4]
        measurements_data["ul_thp"]=row[5]
        measurements_data["latency"]=row[6] 
        measurements_data["tx_bytes"]=row[7] 
        measurements_data["rx_bytes"]=row[8] 
        #Meas_Data["all_data"].append(measurements_data)
        #Meas_Data["name_of_nf"] = row[0]
        measurements_data={} """
    #return jsonify(Meas_Data),200
    #tT = 5
    #str2 = 'iperf -i 1 -fk -B 12.1.1.2 -b 200M -c 192.168.72.135 -r -t'+ str(tT)+ '| awk -Wi -F\'[ -]+\' \'/sec/{print $3"-"$4" "$8}\''
    #client=docker.from_env()
    #container = client.containers.get(id)
    #run=container.exec_run(['sh', '-c', str2])
    #temp1=(run.decode("utf-8"))
    #out1 = [int(s) for s in temp1.split() if s.isdigit() and int(s)>100]
    #ulTh = sum(out1[0:tT+1])/len(out1[0:tT+1])
    #print(ulTh)
    #dlTh = sum(out1[tT+1:])/len(out1[tT+1:])
    #print(out1[t+1:])
    #type(out1)
    #print(out1)
    #Throughput = ((ulTh+dlTh)/1000) 
    #print(out2)
  
    Net_Stat["Throughput"] = '31.2 Mbps'#"{:.2f}".format(Throughput) + 'Mbps'
    Net_Stat["Successful Connects"] = '80%'
    Net_Stat["Latency"] = '13ms'
    #return jsonify(monitor_nf),200
    
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
    Plot_Stat["Successful Connects"]= a
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
    Plot_Stat["Throughput"]= a

    y =[]
    for i in range(len(x)):
        y.append(randint(10,15))
    
    b = {}
    a =[]
    for i in range(len(x)):
        b['x'] = x[i]
        b['y'] = y[i]
        a.append(b.copy())
    
    Plot_Stat["Latency"]= a
    
    y =[]
    for i in range(len(x)):
        y.append(randint(10,25))
    
    b = {}
    a =[]
    for i in range(len(x)):
        b['x'] = x[i]
        b['y'] = y[i]
        a.append(b.copy())
    
    Plot_Stat["Packet Loss"] = a
    
    y =[]
    for i in range(len(x)):
        y.append(randint(50,100))
    
    b = {}
    a =[]
    for i in range(len(x)):
        b['x'] = x[i]
        b['y'] = y[i]
        a.append(b.copy())
        
    Plot_Stat["Mobility"]= a
    
    return Net_Stat, Plot_Stat

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