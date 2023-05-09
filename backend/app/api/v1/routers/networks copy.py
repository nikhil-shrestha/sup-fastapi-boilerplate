import os
import subprocess
import time
from random import randint

import threading
# import measurements
import app.utils.measurements as measurements
import app.utils.packets as packets

import docker

from fastapi import APIRouter, Body, Depends, HTTPException, Security

import logging

from enum import Enum
from pydantic import BaseModel

from typing import Optional



router = APIRouter(prefix="/networks", tags=["networks"])


################################################################################################################################################################
#                                                                Defining Dictionaries for List of Elements                                                    #
################################################################################################################################################################
CN_List = [
    {"name" : "OAI", "status" : True},
    {"name" : "free5GC", "status" : True},
    {"name" : "Azure Private 5G Core", "status" : False},
    {"name" : "Open5GS", "status" : False}
]
RAN_List = [
    {"name" : "OAI", "status" : True},
    {"name" : "UERANSIM", "status" : True},
    {"name" : "Baicells", "status" : False},
    {"name" : "Nokia", "status" : False}
]
UE_List = [
    {"name" : "OAI", "status" : True},
    {"name" : "UERANSIM", "status" : True},
    {"name" : "srsRAN", "status" : False},
]
Network_List = [
    {"name" : "All", "ID":0,"status" : True},
    {"name" : "Irvine,CA","ID":1, "status" : True},
    {"name" : "Peru,LA", "ID":2,"status" : True},
    {"name" : "Sweden,EU", "ID":3,"status" : False},
    {"name" : "India,AP", "ID":4,"status" : False},
#    {"name" : "", "ID":5,"status" : False}
]
App_Hosted_List = [
    {"name" : "Cloud", "status" : True},
    {"name" : "Internal", "status" : True},
    {"name" : "External", "status" : True}
]
# App_Details = {
#     "Application Name" : "Pick-N-Pack", "status" : True,
#     "details" : {
#        "inputs" : {
#                     "Count" : 2,
#                     "Input1" : "Weight Sensor",
#                     "Input2": "Video Stream",
#                 },
#         "outputs" : {
#                     "Count" : 2,
#                     "Output1" : "Video Analytics/Dashboard",
#                     "Output2": "Actuator",
#                 }
#     }                
# }

# App_Details = {
#     "Application Name" : "Pick-N-Pack", "status" : True,
#     "details" : {
#        "inputs" : [
#                     { "name": "Weight Sensor","type":"sensor"},
#                     { "name": "Video Stream","type":"camera"}
#                 ],
#        "outputs" : [
#                     { "name": "Video Analytics/Dashboard", "type": "link" },
#                     { "name": "Actuator"}
#                 ]
#     }                
# }


App_Details = {
      "Application Name": "Track-N-Label",
      "status": "true",
      "details": {
        "inputs": [
          {
            "name": "Video Stream",
            "type": "dropdown"
          }
        ],
        "outputs": [
          {
            "name": "Video Analytics/Dashboard",
            "type": "link",
            "url": "https://track-n-label.webflow.io"
            #"url": "https://wplandingpag.vps.webdock.cloud/demo/player.html"
          }
        ]
      }
    }



Device_List = [
    {"name" : "oai-ue1", "Type" : "Camera"},
    {"name" : "oai-ue2", "Type" : "Sensors"},
    {"name" : "oai-ue3", "Type" : "AGVs"},
    {"name" : "oai-ue4", "Type" : "Actuators"},
    {"name" : "oai-ue5", "Type" : "Others"}
]
################################################################################################################################################################
#                                                                        Input Options for APIs                                                                #
################################################################################################################################################################
class Item(BaseModel):
    id: str
    value: str

class Message(BaseModel):
    message: str

class CN_options(str, Enum):
    free5gc = "free5gc"
    OAI = "OAI"
    Azure = "Azure Private 5GCore"
    Nokia = "Nokia"

class RAN_options(str, Enum):
    UERANSIM = "UERANSIM"
    OAI = "OAI"
    AirSpan = "AirSpan"
    Baicells = "Balicells"

class UE_options(str, Enum):
    free5gc = "UERANSIM"
    OAI = "OAI"
    Nokia = "srsRAN"

class APP_options(str, Enum):
    free5gc = "Cloud"
    OAI = "Internal"
    Nokia = "External"

class Device_options(str, Enum):
    Device1 = "oai-ue1"
    Device2 = "oai-ue2"
    Device3 = "oai-ue3"
    Device4 = "oai-ue4"
    Device5 = "oai-ue5"

class RAN_Parameters(BaseModel):
    Band: Optional[str] = '78'
    AMF_IP:Optional[str] = '10.2.50.115'#192.168.71.132'
    MCC: Optional[str] = '001'
    MNC: Optional[str] = '01'
    TAC: Optional[str] = '1'
    SST: Optional[str] = '1'
    SD: Optional[str] = '1'
    Gain: Optional[str] = '80'

################################################################################################################################################################
#                                                                             Tags for APIs                                                                    #
################################################################################################################################################################
tags_metadata = [
    {
        "name": "Get Core Networks List",
        "description": "List of Core Network (CN) Available.",
    },
    {
        "name": "Get Access Points List",
        "description": "List of Access Points Available.",
    },
    {
        "name": "Get Devices List",
        "description": "List of Devices Available.",
    },
    {
        "name": "Deploy a Network",
        "description": "Deploy a network with Core Network (CN) and Radio Access Network (RAN) stack of your choice.",
    },
    {
        "name": "Stop a Network",
        "description": "Stop the network with Core Network (CN) and Radio Access Network (RAN) stack of your choice.",
    },
    {
        "name": "Get CN details",
        "description": "Get information about the Core Network (CN) of the deployed network.",
    },    
    {
        "name": "Get RAN details",
        "description": "Get information about the Radio Access Network (RAN) of the deployed network.",
    },    
    {
        "name": "Get gNB details",
        "description": "Get information about the gNBs deployed in the network.",
    },   
    {
        "name": "Get UE details",
        "description": "Get information about the UEs in the network.",
    },
    {
        "name": "Get Network Summary",
        "description": "Get Network Statistics such as Latency, Packet Loss, Throughput and Mobility",
    },
    {
        "name": "Get Network Statistics",
        "description": "Get Network Statistics such as Latency, Packet Loss, Throughput and Mobility",
    },
    {
        "name": "Get Network Lists",
        "description": "Get List of Deployed Networks",
    },  
    {
        "name": "Get Network Inspect Details",
        "description": "Get Network Functions Terminals, Logs and Packets",
    },     
    {
        "name": "Get Logs",
        "description": "Get logs of the container with containerid mentioned.",
    },
    {
        "name": "Get Console",
        "description": "Get Console of the container with containerid mentioned.",
    },
    {
        "name": "Get Packets",
        "description": "Get Packets of the container with containerid mentioned.",
    },  
    {
        "name": "Get Network Issues and Resolving Actions",
        "description": "Get Network Issues if any of the container fails.",
    },     
    {
        "name": "SignIn",
        "description": "Authenticating for accessinng the simulator app.",
    },  
    {
        "name": "Get RAN Parameters",
        "description": "Get Access Point parameters for Deploying.",
    },          
]                        



################################################################################################################################################################
#                                                                       Functions for APIs                                                                     #
################################################################################################################################################################
# Functions
def Config_Status(Config_Step:str):
    os.chdir('/home/dolcera/5GTestbed/openairinterface5g/targets/PROJECTS/GENERIC-NR-5GC/CONF')
    pwd=os.getcwd()
    print(pwd)
    msg_str = []
    with open("gnb_5fi_b210.conf",'r') as f:
        for line in f:
            if "mcc" in line and Config_Step == '1':
                print("Configuring Network Codes")
                msg_str = "Configuring Network Codes"
                time.sleep(1)
            elif "sst" in line and Config_Step == '2':
                print("Configuring Slice")
                msg_str = "Configuring Slice"
                time.sleep(1)
            elif "Physical" in line and Config_Step == '3': 
                print("Configuring Cell with Band and Carrier Frequencies")
                msg_str = "Configuring Cell with Band and Carrier Frequencies"   
            elif "NETWORK_INTERFACES" in line and Config_Step == '4':
                print("Configured AMF IP Address")
                msg_str = "Configured AMF IP Address"
            elif "max_rxgain" in line and Config_Step == '5':
                print("Tuning the Antenna Transmit/Receive Power")
                msg_str = "Tuning the Antenna Transmit/Receive Power"    
    return msg_str




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



def run_command(command):
    print(subprocess.check_output('pwd'))
    #cmd1 = subprocess.Popen(['echo',sudo_password], stdout=subprocess.PIPE)
#   popen = subprocess.Popen(['sudo','-S'] + args, stdin=cmd1.stdout, stdout=subprocess.PIPE)
    process = subprocess.Popen(command,stdout=subprocess.PIPE,preexec_fn=os.setpgrp)
    count = 0
    sucess = 0
    while True:
        output = process.stdout.readline()
        if output == '' and process.poll() is not None:
            break
        if output:
            print(output.strip())
            if 'Frame.Slot' in str(output):
                count+=1
            if 'PDUSESSIONSetup successful message' in str(output):
                sucess = 1
        if count>5:
            #count = 0
            print('CMD is closed')
            pgid = os.getpgid(process.pid)
            print(pgid)
            os.system("sudo pkill -9 -P " + str(pgid))
            #subprocess.check_output("sudo pkill {}".format(pgid))
            #process.kill()
            #break
            return 'Failure'

        if sucess == 1:
            #sucess = 0
            pgid = os.getpgid(process.pid)
            print(pgid)
            os.system("sudo pkill -9 -P " + str(pgid))
            return 'success'

def Deploy_gNB(command):
    print(subprocess.check_output('pwd'))
    #cmd1 = subprocess.Popen(['echo',sudo_password], stdout=subprocess.PIPE)
#   popen = subprocess.Popen(['sudo','-S'] + args, stdin=cmd1.stdout, stdout=subprocess.PIPE)
    process = subprocess.Popen(command,stdout=subprocess.PIPE,preexec_fn=os.setpgrp)
    count = 0
    sucess = 0
    while True:
        output = process.stdout.readline()
        if output == '' and process.poll() is not None:
            break
        if output:
            print(output.strip())
            return {process.pid,'Callibrated and Deployed Successfully'}





def num_PDUsessions(client,id):
    for container in client.containers.list():
        if id in str(container.id):
            run=container.exec_run('nr-cli --dump')
            temp1=(run.output.decode("utf-8")).split("\n")
            ue_imsi=temp1[0]
            temp1=container.exec_run('nr-cli ' + ue_imsi + ' -e ps-list')
            temp2=(temp1.output.decode("utf-8")).split("PDU Session")
            st = "state: PS-ACTIVE"
            res = [i for i in temp2 if st in i]
            return len(res)

def get_IPaddress(client,id):
    #print("get_IPaddress")
    container=client.containers.list(filters={"id":id})
    if len(container)==0:
        print ("no container running with given id")
        return
    try:
        if 'rfsim' in container[0].name:
            run = container[0].exec_run(['sh', '-c', 'hostname -i'])
            ip_add=(run.output.decode("utf-8")).split("\n")
            return ip_add[0]
        else:    
            ip_add = container[0].attrs["NetworkSettings"]["Networks"]["free5gc-compose_privnet"]["IPAddress"]
            return ip_add
    except: 
        print ("Error in getting IP address")
        return    


def get_gNB(client, id): # get gNB for the UE with container id = id
    #print("get_gnb")
    container=client.containers.list(filters={"id":id})
    if len(container)==0:
        print ("no container running with given id")
        return
    try:
        if 'oai' in container[0].name:
            run = container[0].exec_run(['sh', '-c', 'echo $RFSIMULATOR'])
            out=(run.output.decode("utf-8")).split("\n")
            return out[0]
        else:
            run = container[0].exec_run(['sh', '-c', 'echo $GNB_HOSTNAME'])
            out=(run.output.decode("utf-8")).split("\n")
            return out[0]
    except: 
        print ("Error in running exec_run")    
        return


def ues_served(client, container1):
    #print("ues_served")
    list_ue_containers=[]
    for container in client.containers.list():
        try:
            if 'ue' in container.name:
                if 'oai' in container.name:
                    run = container.exec_run(['sh', '-c', 'echo $RFSIMULATOR'])
                    out=(run.output.decode("utf-8")).split("\n")
                    ip = get_IPaddress(client,container1.id)
                    if ip == out[0]:
                        list_ue_containers.append(container)
                else:
                    run = container.exec_run(['sh', '-c', 'echo $GNB_HOSTNAME'])
                    out=run.output.decode("utf-8")
                    if container1.name in str(out):
                        list_ue_containers.append(container)
        except: 
            print ("Error in ues_served")            
    return list_ue_containers

list_valid=['nrf','amf','upf','gnb','ue','udm','udr','smf','ausf','nssf','pcf','n3iwf','spgwu']  
list_nfs=['nrf','amf','upf','udm','udr','smf','ausf','nssf','pcf','n3iwf','spgwu']  

def count_NFs(client):
    counts=0
    no_UEs=0
    no_gNBs=0
    no_UPFs=0
    for container in client.containers.list():
        match = next((x for x in list_valid if x in container.name), False)
        if match==False:
            continue        
        if "free5gc" in str(container.image):
            counts+=1
        elif "oai" in str(container.name):
            match1 = next((x for x in list_nfs if x in container.name), False)
            if match1!=False:
                counts+=1   
        if 'ue' in str(container.name):
            no_UEs+=1
        if 'gnb' in str(container.name):
            no_gNBs+=1
        if "free5gc" in str(container.image) and 'upf' in str(container.name):
            no_UPFs+=1
        elif "oai" in str(container.name) and 'spgwu' in str(container.name):    
            no_UPFs+=1      
    #print(counts)
    #print(no_UEs)
    #print(no_gNBs)
    #print(no_UPFs)
    return counts, no_UEs, no_gNBs, no_UPFs

def display_gNBDetails(client):
    #print("display_gNBDetails")
    List_gNBs=[]
    gNB_details = {}
    for container in client.containers.list():
        gNB_details = {}
        if 'gnb' in container.name:
            #print(container.name)
            gNB_details["Name_of_gNB"]=container.name
            #no_PDUsessions = 0
            ues = ues_served(client,container)
            gNB_details["no_UEs"] = len(ues)
            #for ue in ues:
            #    no_PDUsessions += num_PDUsessions(client,ue.id)
            #gNB_details["no_PDUsess"] =  no_PDUsessions   
            gNB_details["Management_IP"] = get_IPaddress(client,container.id)
            state= 'Active'
            gNB_details["State"] = state
            List_gNBs.append(gNB_details)
    return List_gNBs        


def display_UEDetails(client):
    #print("display_UEDetails")
    List_UEs=[]
    for container in client.containers.list():
        UE_details = {}
        if 'ue' in container.name:
            #print(container.name)
            UE_details["Name_of_UE"]=container.name
            UE_details["Connected to gNB"] =  get_gNB(client,container.id)   
            UE_details["Management_IP"] = get_IPaddress(client,container.id)
            state= 'Connected'
            UE_details["State"] = state
            List_UEs.append(UE_details)
    return List_UEs 


def get_logs(client,id):
    for container in client.containers.list():
        if id in str(container.id):
            logs = container.logs().decode("utf-8")
            return logs,200

def get_console(client,id):
    for container in client.containers.list():
        if id in str(container.id):
            console = container.logs().decode("utf-8")
            return console


#@router.route('/monitor_nf_packets/<id>')
def get_packets(client,id):
    #dictionaries for json
    monitor_nf={"packet data":''}
    container=client.containers.list(filters={"id":id})
    print(container[0].name)
    monitor_nf["packet data"]=packets.get_packets(container[0].name)
    return monitor_nf,200

def get_network_attention(tag_issue,CMessage,CSite,CSwitch,CPort,CID):
    network_attention = [{"Tag":tag_issue,"Message" : CMessage, "Site" : CSite,"Switch":CSwitch, "Port": CPort,"ID":CID}]      
    return network_attention

def get_resolved_action(tag_issue,CID,CMessage,CSite):
    resolved_action = [{"Tag":tag_issue,"ID":CID,"Message" : CMessage, "Site" : CSite}]      
    return resolved_action



################################################################################################################################################################
#                                                                     List of Elements APIs                                                                    #
################################################################################################################################################################
###############################################################
# Exception Handler
#@router.exception_handler(ValidationError)
#def validation_exception_handler(request, exc):
#    return PlainTextResponse(str(exc), status_code=400)

#@router.exception_handler(RequestValidationError)
#async def validation_exception_handler(request, exc):
#    print(f"OMG! The client sent invalid data!: {exc}")
#    return await request_validation_exception_handler(request, exc)

# @router.get("/models/{model_name}")
# async def get_model(model_name: ModelName):
#      print('get_model')
#      print(model_name)
###############################################################

@router.get('/CN_list', tags = ["Get Core Networks List"], status_code=200)
def get_cn_List()-> dict:
    return {"CN_List": CN_List}

###############################################################

@router.get('/RAN_list', tags = ["Get Access Points List"],status_code=200)
def get_ran_List()-> dict:
    return {"RAN_List": RAN_List}
###############################################################

@router.get('/UE_list', tags = ["Get Devices List"],status_code=200)
def get_ue_List()-> dict:
    return {"UE_List": UE_List}
###############################################################

@router.get('/Network_List', tags = ["Get Network Lists"],status_code=200)
def get_Network_List()-> dict:
    return {"Network_List": Network_List}

@router.get('/ApplicationDetails/', tags = ["Get Application Details"],status_code=200)
def get_Application_Details(URL)-> dict:
    return {"Application Details": App_Details}    

@router.get('/ApplicationDeviceOptions/', tags = ["Get Application Device Options"],status_code=200)
def get_Application_DeviceOptions()-> dict:
    return {"Application Device Options": Device_List} 

################################################################################################################################################################
#                                                                 Authentication APIs                                                                       #
################################################################################################################################################################

@router.get(
    "/SignIn/{Name}", 
    tags=["SignIn"], 
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found"}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"You are ready to go!"}
                }
            },
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"response":"Invalid Credentials! Please check and enter correctly."}
                }
            },
        },        
    },
)
def SignIn(Name,Password):
    if Name == 'Dolcera' and Password == 'Dolcera@123':
        return {"response":"You are ready to go for deployment!"} 
    else :
        return {"Invalid Credentials! Please check and enter correctly"}
    

################################################################################################################################################################
#                                                                 Authentication APIs                                                                       #
################################################################################################################################################################

@router.get(
    "/GetRANParameters", 
    tags=["Get RAN Parameters"], 
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found"}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Sucessfully Deployed Access Points"}
                }
            },
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"response":"Invalid Parameters! Please check and enter correctly."}
                }
            },
        },        
    },
)
def GetRANParameters():
    os.chdir('/home/dolcera/5GTestbed/openairinterface5g/doc/tutorial_resources')
    #cmd = 'docker-compose -f docker-compose-basic-nrf down'
    #os.system(cmd)
    #time.sleep(3)
    cmd = 'docker-compose -f docker-compose-basic-nrf.yaml up -d mysql oai-nrf oai-udr oai-udm oai-ausf oai-amf oai-smf oai-spgwu oai-ext-dn'
    os.system(cmd)
    time.sleep(5)
    RAN_Parameters = {
    "Band"  :[],
    "AMF_IP":[],
    "MCC"   :[],
    "MNC"   :[],
    "TAC"   :[],
    "SST"   :[],
    "SD"    :[],
    "Gain"  :[],    
    }
    state= 'active'
    IP = '192.168.70.132'
    RAN_Parameters["Band"] = '78'
    RAN_Parameters["AMF_IP"] = IP #f'"{IP}"'
    RAN_Parameters["MCC"] = '001'
    RAN_Parameters["MNC"] = '01'
    RAN_Parameters["TAC"] = '1'
    RAN_Parameters["SST"] = '1'
    RAN_Parameters["SD"] = '1'
    RAN_Parameters["Gain"] = '40'
    return RAN_Parameters

################################################################################################################################################################
#                                                                 Realtime Accesspoint Deploy API                                                                       #
################################################################################################################################################################

@router.get(
    "/RAN_Deploy", 
    tags=["RAN Deployment"], 
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found"}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Sucessfully Deployed Access Points"}
                }
            },
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"response":"Invalid Parameters! Please check and enter correctly."}
                }
            },
        },        
    },
)
def RAN_Deploy(params=Depends(RAN_Parameters)):
    #print(RAN_Parameters)
    choice = 2
    if (choice==1):   
        os.chdir('/home/dolcera/5GTestbed/openairinterface5g/targets/PROJECTS/GENERIC-NR-5GC/CONF')
        AMF_IPc = f'"{params.AMF_IP}"'
        write_var_to_file(config_file="gnb_5fi_b210.conf", variable_name="dl_frequencyBand", variable_content=params.Band)
        write_var_to_file(config_file="gnb_5fi_b210.conf", variable_name="ul_frequencyBand", variable_content=params.Band)
        #write_var_to_file(config_file="gnb_5fi_b210.conf", variable_name="ipv4", variable_content=AMF_IPc)

        write_var_to_file(config_file="gnb_5fi_b210.conf", variable_name="mcc", variable_content=params.MCC)
        write_var_to_file(config_file="gnb_5fi_b210.conf", variable_name="mnc", variable_content=params.MNC)
        write_var_to_file(config_file="gnb_5fi_b210.conf", variable_name="tracking_area_code", variable_content=params.TAC)
        write_var_to_file(config_file="gnb_5fi_b210.conf", variable_name="sst", variable_content=params.SST)
        write_var_to_file(config_file="gnb_5fi_b210.conf", variable_name="sd", variable_content=params.SD)
    
        os.chdir('/home/dolcera/5GTestbed/openairinterface5g/cmake_targets/ran_build/build')

        #cmd = 'sudo ./nr-softmodem -O ../../../targets/PROJECTS/GENERIC-NR-5GC/CONF/gnb_5fi_b210.conf --sa -E --continuous-tx &'
        #os.system(cmd)
        #Sudo_Pass = 'dOLCERA@123'
        #os.system('echo %s|sudo -S %s' % (Sudo_Pass, cmd))
        time.sleep(3)

        Gain = [60,80,90]
        args = ["sudo","./nr-softmodem", "-O","../../../targets/PROJECTS/GENERIC-NR-5GC/CONF/gnb_5fi_b210.conf", "--sa", "-E", "--continuous-tx"]
    
        for G in Gain:
            for x in range(100):
                print(G)  
            os.chdir('/home/dolcera/5GTestbed/openairinterface5g/targets/PROJECTS/GENERIC-NR-5GC/CONF')
            print(subprocess.check_output('pwd'))
            write_var_to_file(config_file="gnb_5fi_b210.conf", variable_name="max_rxgain", variable_content=str(G))
            os.chdir('/home/dolcera/5GTestbed/openairinterface5g/cmake_targets/ran_build/build')
            print(subprocess.check_output('pwd'))
            outcom = run_command(args)
            time.sleep(5)
            logging.basicConfig(filename="AP_Update.txt", level=logging.DEBUG,
                    format="%(asctime)s %(message)s", filemode="w")
            Sel_Gain = G            
            if outcom == 'success':
                os.chdir('/home/dolcera/5GTestbed/openairinterface5g/cmake_targets/ran_build/build')
                print(subprocess.check_output('pwd'))
                Out = Deploy_gNB(args)
                logging.debug("Deployed Successfully")  
                result =  f'Deployed Sucessfully with Gain {Sel_Gain}'
            else:
                print('Callibrating Please wait for some time')
                logging.debug("Callibrating Please wait for some time")
                result  = 'Not tuned properly rescan once again'
        
            if G == 90 and result == 'Not tuned properly rescan once again':
                Out = Deploy_gNB(args)
                result =  f'Deployed Sucessfully with Gain {Sel_Gain}'
            
                #result = "Deployed Sucessfully"
                #return result
    elif choice == 2:
            AMF_IPc = f'"{params.AMF_IP}"'
            plmn_id = f'"{params.MCC}{params.MNC}"'
            print(plmn_id)
            Sel_Gain = 80
            write_var_to_file(config_file="start_stop.py", variable_name="nr_band", variable_content=params.Band)
            write_var_to_file(config_file="start_stop.py", variable_name="tx_gain", variable_content=str(Sel_Gain))
            write_var_to_file(config_file="start_stop.py", variable_name="epc_plmn", variable_content=plmn_id)
            write_var_to_file(config_file="start_stop.py", variable_name="state1", variable_content=f'"{"started"}"')
            
            print(subprocess.check_output('pwd'))

            command = "sudo su -c 'slapos console --cfg ~/.slapos/slapos-client.cfg /home/dolcera/5Fi_APIs/Deploy-APIs/start_stop.py'"

            ret = os.system(command)#subprocess.run(command, capture_output=True, shell=True)

            print(ret)
            result =  f'Deployed Sucessfully with Gain {Sel_Gain}'
            #result = "Deployed Sucessfully"
    return result #templates.TemplateResponse('index.html', context={'request': request, 'result': result})




################################################################################################################################################################
#                                                                Network Deploy & Undeploy APIs                                                                #
################################################################################################################################################################

@router.get(
    "/deploy_scenario/", 
    tags=["Deploy a Network"], 
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found"}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Success! Network deployed!"}
                }
            },
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"response":"Invalid parameters! Please use valid parameters."}
                }
            },
        },        
    },
)
def deploy_Scenario(CN_Make: CN_options,CN_Quantity,RAN_Make: RAN_options,RAN_Quantity,Cameras_Make: UE_options,Cameras_Quantity,Sensors_Make: UE_options,Sensors_Quantity,AGVs_Make:UE_options,AGVs_Quantity,Actuators_Make:UE_options,Actuators_Quantity,Others_Make:UE_options, Other_Quantity):
    if CN_Make == 'OAI' and RAN_Make == 'OAI':
        print("OAI CN and OAI RAN")
        os.chdir('../')
        #check if directory already exists
        # if os.path.isdir('openairinterface-5g'):
        #     print('True')
        # else:
        #     print('False')    
        #     os.system('git clone https://github.com/golisrikanth1989/openairinterface-5g')
        os.chdir('Docker-Prac-USRP')
        #os.chdir('openairinterface-5g')
        # os.system('git checkout develop')
        # os.system('git pull')
        #os.chdir('ci-scripts/yaml_files/5g_rfsimulator')
        os.system('docker ps -aq | xargs docker rm -f')
        time.sleep(5)
        for i in range(int(CN_Quantity)):
            cn_str = "cn" + str(i+1)
            
            # cmd = 'docker-compose -f docker-compose.yaml up -d  tcpdump'
            # os.system(cmd)

            cmd = 'docker-compose -f docker-compose-prac.yaml up -d  mysql oai-nrf oai-amf oai-smf oai-spgwu oai-ext-dn'
            os.system(cmd)
            time.sleep(5)

            cmd = 'docker-compose -f docker-compose-prac.yaml up -d oai-gnb1'
            print(cmd)
            os.system(cmd)
            time.sleep(5)

            cmd = 'docker-compose -f docker-compose-prac.yaml up -d oai-gnb2'
            print(cmd)
            os.system(cmd)
            time.sleep(5)
            
            # For First gNB
            cmd = 'docker-compose -f docker-compose-prac.yaml up -d oai-nr-ue1' 
            print(cmd)
            os.system(cmd)
            time.sleep(5)

            cmd = 'docker-compose -f docker-compose-prac.yaml up -d oai-nr-ue2' 
            print(cmd)
            os.system(cmd)
            time.sleep(5)
            
            # For Second gNB  
            cmd = 'docker-compose -f docker-compose-prac.yaml up -d oai-nr-ue3' 
            print(cmd)
            os.system(cmd)
            time.sleep(5)
            
            cmd = 'docker-compose -f docker-compose-prac.yaml up -d oai-nr-ue4' 
            print(cmd)
            os.system(cmd)
            time.sleep(5)
                        
            cmd = 'docker-compose -f docker-compose-prac.yaml up -d oai-nr-ue5' 
            print(cmd)
            os.system(cmd)
            time.sleep(10)
            print('OAI CN and OAI RAN with UEs are Deployed')
            client=docker.from_env()
            measurements_thread=threading.Thread(target=measurements.get_measurements, args=(client,), name="docker_measurements")
            measurements_thread.start()
    elif CN_Make == 'OAI' and RAN_Make == 'UERANSIM':
        print("Selected OAI CN and UERANSIM Make")
        os.chdir('../')
        os.chdir('oai-cn5g-fed')
#        os.system('git checkout develop')
#        os.system('git pull')
        os.chdir('docker-compose')
#        os.system('docker ps -aq | xargs docker rm -f')
        time.sleep(30)
        for i in range(int(CN_Quantity)):
            cn_str = "cn" + str(i+1)
            cmd = 'docker-compose -p '+ cn_str + ' -f docker-compose-basic-vpp-nrf.yaml up -d oai-nrf'
            os.system(cmd)
            time.sleep(10)

            cmd = 'docker-compose -p '+ cn_str + ' -f docker-compose1.yaml up -d mysql'
            os.system(cmd)
            time.sleep(10)
            cont_name = cn_str + '_oai-nrf_1'
            cmd = 'docker inspect -f \'{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}\' ' + cont_name
            nrf_ipaddr = os.system(cmd)
            cont_name = cn_str + '_mysql_1'
            cmd = 'docker inspect -f \'{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}\' ' + cont_name
            mysql_ipaddr = os.system(cmd)

            cmd = 'echo \"mysql_ipaddr='+ str(mysql_ipaddr) +'\" \"nrf_ipaddr='+str(nrf_ipaddr)+'\" > .env' + ' && docker-compose -p '+ cn_str + ' -f docker-compose1.yaml up -d oai-amf'
            os.system(cmd)
            time.sleep(10)

            cmd = 'echo \"nrf_ipaddr1='+str(nrf_ipaddr)+'\" > .env' + ' && docker-compose -p '+ cn_str + ' -f docker-compose1.yaml up -d oai-smf'
            os.system(cmd)
            time.sleep(10)
            
            cont_name = cn_str + '_oai-smf_1'
            cmd = 'docker inspect -f \'{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}\' ' + cont_name
            smf_ipaddr = os.system(cmd)
            
            cmd = 'echo \"nrf_ipaddr2='+ str(nrf_ipaddr) +'\" \"smf_ipaddr='+str(smf_ipaddr)+'\" > .env' + ' && docker-compose -p '+ cn_str + ' -f docker-compose1.yaml up -d oai-spgwu' # oai-ext-dn'
            os.system(cmd)
            time.sleep(15)
            print("OAI ",cn_str," is UP")
            print("Connecting OAI-RAN Access Points for ",cn_str)
            
            cont_name = cn_str + '_oai-amf_1'
            cmd = 'docker inspect -f \'{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}\' ' + cont_name
            amf_ipaddr = os.system(cmd)
            print(str(amf_ipaddr))
            cmd = 'echo \"amf_ipaddr='+ str(amf_ipaddr) +'\" > .env' + ' && docker-compose -p '+ cn_str + ' -f docker-compose1.yaml up -d --scale oai-gnb='+str(RAN_Quantity)
            os.system(cmd)
            time.sleep(10)   

            for i in range(int(RAN_Quantity)):
                pr_name = cn_str
                cmd = 'echo \"amf_ipaddr='+ str(amf_ipaddr) +'\" > .env' + ' && docker-compose -p '+ pr_name + ' -f docker-compose1.yaml up -d oai-gnb'
                os.system(cmd)
                cont_name = pr_name + '_oai-gnb_1'
                print(cont_name)
                cmd = 'docker inspect -f \'{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}\' ' + cont_name
                gnb_ipaddr = os.system(cmd)
                nUEs = random.randint(1,4)
                cmd = 'echo \"gnb_ipaddr1='+ str(gnb_ipaddr) +'\" > .env' + ' && docker-compose -p '+ pr_name + ' -f docker-compose1.yaml up -d --scale oai-nr-ue='+str(nUEs)
                os.system(cmd)
                time.sleep(10)
    else :
        return {"Choose Approproiate Option"}
    return {"response":"Success! Network deployed!"} 

""" def deploy_Scenario(CN: CN_options, CN_Quantity, RAN: RAN_options, RAN_Quantity):
    #try:
    # select scenario of CN and RAN and then deploy the scenario
    if CN == 'free5gc' and RAN == 'UERANSIM':
        print("free5gc CN and UERANSIM RAN")
        os.chdir('../')
        #check if directory already exists
        if os.path.isdir('5-fi-docker'):
            print('True')
        else:
            print('False')    
            os.system('git clone https://github.com/pragnyakiri/5-fi-docker')
        os.chdir('5-fi-docker')
        os.system('git pull')
        print("Pulled")            
        os.chdir('ueransim')
        os.system('make')
        print("ueransim made")
        os.chdir('../free5gc-compose')
        os.system('make base')
        print("make base")
        os.system('docker-compose build')
        os.system('docker-compose up -d')
        os.chdir('../..')
        os.chdir('Deploy-APIs')
        pwd=os.getcwd()
        print(pwd)
        return {"response":"Success! Network deployed!"}
    elif CN == 'free5gc' and RAN == 'OAI':
        print("free5gc CN and OAI RAN")
        os.chdir('../')
        #check if directory already exists
        if os.path.isdir('5-fi-docker-oai'):
            print('True')
        else:
            print('False')    
            os.system('git clone https://github.com/pragnyakiri/5-fi-docker-oai')
        os.chdir('5-fi-docker-oai')
        os.system('git pull')
        os.chdir('free5gc-compose')
        os.system('make base')
        print("make base")        
        os.system('sudo docker-compose build')
        os.system('sudo docker-compose up -d --remove-orphans')
        os.chdir('../..')
        os.chdir('Deploy-APIs')
        pwd=os.getcwd()
        print(pwd)
        return {"response":"Success! Network deployed!"}
    elif CN == 'OAI' and RAN == 'OAI':
        print("OAI CN and OAI RAN")
        os.chdir('../')
        #check if directory already exists
        if os.path.isdir('openairinterface-5g'):
            print('True')
        else:
            print('False')    
            os.system('git clone https://github.com/pragnyakiri/openairinterface-5g')
        os.chdir('openairinterface-5g')
        os.system('git checkout develop')
        os.system('git pull')
        os.chdir('ci-scripts/yaml_files/5g_rfsimulator')
        os.system('docker-compose up -d mysql oai-nrf oai-amf oai-smf oai-spgwu oai-ext-dn')
        print("CN is UP")   
        time.sleep(30)     
        os.system('docker-compose ps -a')
        time.sleep(10)
        os.system('docker-compose up -d oai-gnb')
        time.sleep(20)
        os.system('docker-compose ps -a')
        time.sleep(20)
        os.system('docker-compose up -d oai-gnb2')
        time.sleep(20)
        os.system('docker-compose ps -a')
        time.sleep(20)          
        os.system('docker-compose ps -a')
        os.system('docker-compose up -d oai-nr-ue1')
        time.sleep(20)     
        os.system('docker-compose ps -a')
        time.sleep(20)     
        os.system('docker-compose ps -a')
        os.system('docker-compose up -d oai-nr-ue2')
        time.sleep(20)     
        os.system('docker-compose ps -a')
        os.chdir('../../../..')      
        os.chdir('Deploy-APIs')
        pwd=os.getcwd()
        print(pwd)
        return {"response":"Success! Network deployed!"} 
    else: 
        print("Inside ELSE")
        #except ValidationError as err:
        raise HTTPException(status_code=422, detail="Please enter valid parameter values.")
        #raise RequestValidationError(exc="Please enter valid parameter values.") """


###############################################################
@router.get(
    '/stop_scenario/{CN}/{RAN}', 
    tags=["Stop a Network"],
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found"}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Success! Network deployed!"}
                }
            },
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"response":"Invalid parameters! Please use valid parameters."}
                }
            },
        },        
    },
) 
def stop_scenario(CN: CN_options,RAN: RAN_options):
    # select scenario of CN and RAN and then deploy the scenario
    if CN == 'free5gc' and RAN == 'UERANSIM':
        print("free5gc CN and UERANSIM RAN")
        pwd=os.getcwd()
        print(pwd)
        os.chdir('../')
        os.chdir('5-fi-docker')
        os.chdir('free5gc-compose')
        os.system('docker-compose down')
        os.chdir('../..')
        os.chdir('Deploy-APIs')
        pwd=os.getcwd()
        print(pwd)         
        return {"response":"Success! Network stopped."}
    elif CN == 'free5gc' and RAN == 'OAI':
        print("free5gc CN and OAI RAN")
        pwd=os.getcwd()
        print(pwd)
        os.chdir('../')
        os.chdir('5-fi-docker-oai')
        os.chdir('free5gc-compose')
        os.system('docker-compose down')
        os.chdir('../..')
        os.chdir('Deploy-APIs')
        pwd=os.getcwd()
        print(pwd)    
        return {"response":"Success! Network stopped."}
    elif CN == 'OAI' and RAN == 'OAI':
        print("OAI CN and OAI RAN")
        pwd=os.getcwd()
        print(pwd)
        os.chdir('../')
        os.chdir('openairinterface-5g')
        os.chdir('ci-scripts/yaml_files/5g_rfsimulator')
        os.system('docker-compose down')
        os.chdir('../../../..')
        os.chdir('Deploy-APIs')
        pwd=os.getcwd()
        print(pwd)
        return {"response":"Success! Network stopped."}

        

################################################################################################################################################################
#                                                                 Network Summary APIs                                                                         #
################################################################################################################################################################
@router.get(
    "/cn_details/", 
    tags=["Get CN details"],
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found. Please check if network is deployed!"}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Success!"}
                }
            },
        },
    },
)
def get_CN_details():
    #dictionaries for json
    CN_Data={"make_of_cn":[],
    "no_nfs":0,
    "no_connected_gnbs":0, #No of gNBs connected
    "state":'',
    "no_upfs":0,
    "cn_count":0,	
    }
    state= 'active'
    client=docker.from_env()
    CN = []    
    Count=0
    for container in client.containers.list():
        print(container.name)
        if 'webui' in container.name:
            CN.append('free5gc')
            Count = Count+1
        elif 'spgw' in container.name:
            CN.append('OAI')
            Count = Count+1        
    if CN==[]:
        raise HTTPException(status_code=404, detail="There is no network deployed. Try deploying a network first.")                     
    CN_Data["make_of_cn"]=CN
    CN_Data["no_nfs"], x, CN_Data["no_connected_gnbs"], CN_Data["no_upfs"]=count_NFs(client)
    CN_Data["state"]=state
    CN_Data["cn_count"]=Count
    return (CN_Data)

###########################################################################
@router.get(
    '/ran_details/', 
    tags=["Get RAN details"],
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found. Please check if network is deployed!"}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Success!"}
                }
            },
        },
    },    
)
def get_RAN_details():
    #dictionaries for json
    RAN_Data={"make_of_ran":[],
    "no_ues":0,
    "no_gnbs":0,
    "gnb_list":[],
    "ue_list":[],
    }
    state= 'active'
    client=docker.from_env()
    RAN=[]
    for container in client.containers.list():
        if 'gnb' in container.name:
            if 'oai' in container.name:
                RAN.append('OAI-SIM')
            #else:
            #    RAN.append('OAI-AP')
    cmd = 'docker logs oai-amf > amf1.log'
    #out = os.popen(cmd).read().strip("\n")
    #print(out)
    os.system(cmd)
    fname = 'amf1.log'
    
    with open(fname) as file:
        # loop to read iterate
        # last n lines and print it
        for line in (file.readlines() [-20:]):
            if '5Fi-OAI' in line:
                RAN.append('5Fi-AP')
            print(line, end ='')  
    if RAN==[]:
        raise HTTPException(status_code=404, detail="There is no network deployed. Try deploying a network first.")                                  
    RAN_Data["make_of_ran"]=RAN
    x, RAN_Data["no_ues"], RAN_Data["no_gnbs"], y=count_NFs(client)
    gnb_List = display_gNBDetails(client)
    UE_List = display_UEDetails(client)
    RAN_Data["gnb_List"]=gnb_List
    RAN_Data["ue_List"]=UE_List
    return RAN_Data


###########################################################################
@router.get(
    '/gnb_details/', 
    tags=["Get gNB details"],
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found. Please check if network is deployed!"}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Success!"}
                }
            },
        },
    },    
)
def get_gNB_details():
    #dictionaries for json
    gNB_Data={
    "gnb_list":[],
    }
    client=docker.from_env()  
    gnb_List = display_gNBDetails(client)
    if gnb_List==[]:
        raise HTTPException(status_code=404, detail="There is no network deployed. Try deploying a network first.")                                   
    gNB_Data["gnb_list"]=gnb_List
    return gNB_Data


###########################################################################
@router.get(
    '/ue_details/', 
    tags=["Get UE details"],
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found. Please check if network is deployed!"}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Success!"}
                }
            },
        },
    },    
)
def get_UE_details():
    #dictionaries for json
    UE_Data={
    "ue_list":[],
    }
    client=docker.from_env()
    UE_List = display_UEDetails(client)
    if UE_List==[]:
        raise HTTPException(status_code=404, detail="There is no network deployed. Try deploying a network first.")
    UE_Data["ue_list"]=UE_List
    return UE_Data


###########################################################################

@router.get(
    '/get_NetworkSummary/', 
    tags=["Get Network Summary"],
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found. There is no container running with the given id."}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Success!"}
                }
            },
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"response":"Invalid parameters! Please use valid parameters."}
                }
            },
        },               
    },    
)

def get_NetworkSummary():
    #dictionaries for json
    Net_Sum={"Number of Cells Available":3000,
    "Number of Cells Active":2400,
    "Percentage Utilization": '80%',
    }
    state= 'active'
    
    return Net_Sum


###########################################################################

@router.get(
    '/get_NetworkStats/', 
    tags=["Get Network Statistics"],
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found. There is no container running with the given id."}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Success!"}
                }
            },
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"response":"Invalid parameters! Please use valid parameters."}
                }
            },
        },               
    },    
)


#@router.route('/monitor_nf_stats/<id>')
#def monitor_nf_stats(id):
def get_NetworkStats():

    Net_Stat={"Successful Connects":[],
    "Throughput":[],
    "Latency":[],
    "Packet Loss":'13%',
    "Mobility":'80%',
    }
    Plot_Stat = {"Successful":[],
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
    Plot_Stat["Packet Loss"]= a
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
    
    return Net_Stat,Plot_Stat


""" def get_NetworkStats():
    #dictionaries for json
    Net_Stat={"Successful Connects":'80%',
    "Throughput":'8.1 Gbps',
    "Latency":'10ms',
    "Packet Loss":'13%',
    "Mobility":'80%',
    }
    state= 'active'

    
    return Net_Stat
 """
################################################################################################################################################################
#                                                                 Inspect Screen APIs                                                                          #
################################################################################################################################################################
@router.get(
    "/Inspect_Details/", 
    tags=["Get Network Inspect Details"],
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found. Please check if network is deployed!"}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Success!"}
                }
            },
        },
    },
)
def get_Inspect_details():
    #dictionaries for json
    Inspect_List={"Inspect_List":[],
    "CID":[],
    "no_containers":0,
    }
    #state= 'active'
    client=docker.from_env()
    Inspect = [] #client.containers.list()#[]
    Cid = []    
    Count=0
    print(client.containers.list())
    for container in client.containers.list():
        print(container.name)
        if 'mysql' in container.name:
            continue
        elif 'webui' in container.name:
            continue
        elif 'ext-dn' in container.name:
            continue
        else:
            Inspect.append(container.name)
            Cid.append(container.id)
            Count = Count+1        
    if Inspect==[]:
        raise HTTPException(status_code=404, detail="There is no network deployed. Try deploying a network first.")                     
    Inspect_List["Inspect_List"]=Inspect
    Inspect_List["CID"]=Cid
    Inspect_List["no_containers"]=Count
    return (Inspect_List)

######################################################################################################################################################
@router.get(
    '/get_logs/<id>', 
    tags=["Get Logs"],
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found. There is no container running with the given id."}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Success!"}
                }
            },
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"response":"Invalid parameters! Please use valid parameters."}
                }
            },
        },               
    },    
)
def get_Logs(id):
    #dictionaries for json    
    Logs={ "nf_logs":''
   }
    client=docker.from_env()
    container=client.containers.list(filters={"id":id})
    if len(container)==0:
        print ("no container running with given id")
        raise HTTPException(status_code=404, detail="There is no container running with the given id.")
        return   
    Logs["nf_logs"]=get_logs(client,id)
    return Logs
######################################################################################################################################################

######################################################################################################################################################
@router.get(
    '/get_packets/<id>', 
    tags=["Get Packets"],
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found. There is no container running with the given id."}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Success!"}
                }
            },
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"response":"Invalid parameters! Please use valid parameters."}
                }
            },
        },               
    },    
)
def get_packets(id):
    client=docker.from_env()
    monitor_nf={"packet data":''}
    container=client.containers.list(filters={"id":id})
    print(container[0].name)
    monitor_nf["packet data"]=packets.get_packets(container[0].name)
    return monitor_nf,200
    #container=client.containers.list(filters={"id":id})
    #return {"packet data": packets.get_packets(container[0].name)}
######################################################################################################################################################
@router.get(
    '/get_console/<id>', 
    tags=["Get Console"],
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found. There is no container running with the given id."}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Success!"}
                }
            },
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"response":"Invalid parameters! Please use valid parameters."}
                }
            },
        },               
    },    
)
def get_Console(id):
    #dictionaries for json    
    Console={ "nf_console":''
   }
    client=docker.from_env()
    container=client.containers.list(filters={"id":id})
    #container = client.containers.get(id)
    run=container.exec_run(['sh', '-c', str2])
    if len(container)==0:
        print ("no container running with given id")
        raise HTTPException(status_code=404, detail="There is no container running with the given id.")
        return   
    Console["nf_console"]=get_console(client,id)
    return Console


######################################################################################################################################################

######################################################################################################################################################
@router.get(
    '/get_NetworkAttentions/', 
    tags=["Get Network Issues and Resolving Actions"],
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found. There is no container running with the given id."}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Success!"}
                }
            },
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"response":"Invalid parameters! Please use valid parameters."}
                }
            },
        },               
    },    
)
def get_NetworkAttentions():
    #dictionaries for json
    NetworkAttentions = []
    Tag = "CN"
    Message = 'SMF is unhealthy'
    Site = "Irvine,CA"
    Switch = "9a9bea"
    Port = "3000"
    ID = "CN12"
    NetworkAttentions.append(get_network_attention(Tag,Message,Site,Switch,Port,ID))

    Tag = "AP"
    Message = 'AP2025 has refused connection issue'
    Site = "Peru,LA"
    Switch = "10ab612"
    Port = "9001"
    ID = "AP025"
    NetworkAttentions.append(get_network_attention(Tag,Message,Site,Switch,Port,ID))
    
    Tag = "Resolved Action"
    ID = "Device23"
    Message = "Battery Replaced"
    Site = "Irvine,CA"
    NetworkAttentions.append(get_resolved_action(Tag,ID,Message,Site))
    
    
    Tag = "Resolved Action"
    ID = "CN12"
    Message = "AMF Redeployed"
    Site = "Sweden,EU"
    NetworkAttentions.append(get_resolved_action(Tag,ID,Message,Site))
    

    Tag = "CN"
    Message = 'AMF is unhealthy'
    Site = "Hyderabad,IND"
    Switch = "9a9bcd"
    Port = "3000"
    ID = "CN5"
    NetworkAttentions.append(get_network_attention(Tag,Message,Site,Switch,Port,ID))

    Tag = "Device"
    Message = 'Needed Battery Replacement'
    Site = "Irvine,CA"
    Switch = "9a9bea"
    Port = "3000"
    ID = "Device23"
    NetworkAttentions.append(get_network_attention(Tag,Message,Site,Switch,Port,ID))

    return NetworkAttentions

######################################################################################################################################################
@router.get(
    '/get_traffic/', 
    tags=["Get UL/DL Traffic"],
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found. There is no container running with the given id."}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Success!"}
                }
            },
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"response":"Invalid parameters! Please use valid parameters."}
                }
            },
        },               
    },    
)
#@router.route('/monitor_nf_packets/<id>')
def get_traffic():
    #dictionaries for json
    monitor_traffic={"UL":'',"DL":''}
#    client=docker.from_env()
 #   container=client.containers.list(filters={"id":id})
    monitor_traffic["UL"]=90.25
    monitor_traffic["DL"]=270.75
    
    return monitor_traffic


######################################################################################################################################################

@router.get(
    '/get_AppStats/', 
    tags=["Get Application Statistics"],
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found. There is no container running with the given id."}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Success!"}
                }
            },
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"response":"Invalid parameters! Please use valid parameters."}
                }
            },
        },               
    },    
)
def get_AppStats(Input1:Device_options,Input2:Device_options,Output1:Device_options,Output2:Device_options):

    App_Stat = {
    "Latency":[],
    "Packet Loss":[],
    }
    state= 'active'
    

    
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
    #y = random.sample(range(0,35), len(x))
    y =[]
    for i in range(0,len(x)):
        y.append(randint(10,15))
        
    b = {}
    a =[]
    for i in range(0,len(x)):
        b['x'] = x[i]
        b['y'] = y[i]
        a.append(b.copy())
    App_Stat["Latency"]= a
    y =[]
    for _ in range(0,len(x)):
        #random.seed(43)
        y.append(randint(10,25))
    b = {}
    a =[]
    for i in range(0,len(x)):
        b['x'] = x[i]
        b['y'] = y[i]
        a.append(b.copy())
    App_Stat["Packet Loss"]= a
    
    return App_Stat




@router.get(
    '/Configure_Status/', 
    tags=["Get Configuration Status"],
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found. There is no container running with the given id."}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Success!"}
                }
            },
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"response":"Invalid Configuration parameters! Please use valid Configuration parameters."}
                }
            },
        },               
    },    
)
def Configure_Status(Config_Step):
    msg = Config_Status(Config_Step)   
    return msg




@router.get(
    '/Validate_AP/', 
    tags=["Validate Access Point"],
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found. There is no container running with the given id."}
                }
            },
        },    
        200: {
            "description": "Successful response.",
            "content": {
                "application/json": {
                    "example": {"response":"Success!"}
                }
            },
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"response":"Access Point Not found! Please check the connections."}
                }
            },
        },               
    },    
)
def Validate_AP():
    os.chdir('/home/dolcera')
    cmd = 'uhd_find_devices'
    out = os.popen(cmd).read().strip("\n")
    #for line in out:
    if 'serial' in out:
        res = out[138:153].strip("\n")
        print(res)
    elif 'No UHD Devices Found' in out:
        res = out
        #print('Hi')
    else:
        res = 'Drivers are not installed'
    #print(type(out))
    return res


@router.get(
    '/Tuning/', 
    tags=["Tuning Access Point"],
    responses={
        404: {
            "description": "The requested resource was not found",
            "content": {
                "application/json": {
                    "example": {"response":"The requested resource was not found. There is no container running with the given id."}
                }
            },
        },    
        200: {
            "description": "Tuning Successfull.",
            "content": {
                "application/json": {
                    "example": {"response":"Success!"}
                }
            },
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"response":"Access Point Not found! Please check the connections."}
                }
            },
        },               
    },    
)
def Tuning():
    Tun = 'Tuning'
    #print(type(out))
    return Tun