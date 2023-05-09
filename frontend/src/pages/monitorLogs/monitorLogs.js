import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

import axiosConfig from "../../config/axios.config";

import "./monitorLogs.scss";
import { Fragment, useEffect, useState } from "react";
import { Box, Container, Toolbar } from "@material-ui/core";

const MonitorLogs = () => {
  //   const [logData, setLogData] = useState(null);

  //   const getNetworkStats = async () => {
  //     try {
  //       const { data } = await axiosConfig.get(
  //         "https://admin:yvsIBNgxFWy38gVt@softinst182366.host.vifib.net/share/private/log/gnb.log"
  //       );

  //       if (data) {
  //         setLogData(data);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   useEffect(() => {
  //     getNetworkStats();
  //   }, []);

  const codeString = `
# lteenb version 2021-09-18, gcc 9.2.1
# Licensed to 'rapid.space' [b4c461ff58d24b2e52a31655bffdc9ae64bbfa51d7dcf33a82]
# SMP C=2 bandwidth=80.0/480 PRACH=1 DRBs=1 RF0=1/1
# Log file format:
# time layer dir ue_id {cell_id rnti sfn channel:} message
# Cell 0x01: nr_arfcn=646666 ul_nr_arfcn=646666 pci=500 mode=TDD rat=nr n_rb_dl=106 n_rb_ul=106 dl_mu=1 ul_mu=1 ssb_mu=1 ssb_arfcn=645984 ssb_prb=14:21 k_ssb=14 coreset0_prb=2:48 coreset0_idx=10
# GBR limits: DL=19.538 Mre/s UL=5.699 Mre/s
# Auto k1=[8,7,7,6,5,4,12,11] k2=[7,4] msg3_k2=8
# Started
07:36:58.783 [NGAP] -  Connecting to 127.0.1.100:38412
07:36:58.890 [NGAP] -  Connect error (code=111)
07:36:58.890 [NGAP] -  Disconnected
07:37:28.891 [NGAP] -  Connecting to 127.0.1.100:38412
07:37:28.891 [NGAP] -  Connect error (code=111)
07:37:28.891 [NGAP] -  Disconnected
07:38:02.040 [PHY] UL    - 01    -  171.19 PRACH: sequence_index=4 ta=6 prb=7:12 symb=2:12 snr=16.6
07:38:02.048 [RRC] UL 0001 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '010010011101001100100100100001000011111'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:02.048 [RRC] -  0001 01 RRC setup request: NG setup not done
07:38:02.048 [RRC] DL 0001 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:02.115 [NGAP] -  Connecting to 127.0.1.100:38412
07:38:02.115 [NGAP] -  Connect error (code=111)
07:38:02.115 [NGAP] -  Disconnected
07:38:03.240 [PHY] UL    - 01    -  291.19 PRACH: sequence_index=7 ta=6 prb=7:12 symb=2:12 snr=16.6
07:38:03.248 [RRC] UL 0002 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '010001001101011110010101011111000100110'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:03.248 [RRC] -  0002 01 RRC setup request: NG setup not done
07:38:03.248 [RRC] DL 0002 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:04.511 [PHY] UL    - 01    -  418.19 PRACH: sequence_index=2 ta=4 prb=7:12 symb=2:12 snr=16.5
07:38:04.518 [RRC] UL 0003 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '101110111000101100001110011100110011000'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:04.518 [RRC] -  0003 01 RRC setup request: NG setup not done
07:38:04.518 [RRC] DL 0003 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:05.791 [PHY] UL    - 01    -  546.19 PRACH: sequence_index=1 ta=6 prb=7:12 symb=2:12 snr=16.6
07:38:05.798 [RRC] UL 0004 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '101100111110011101110010111100010010011'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:05.798 [RRC] -  0004 01 RRC setup request: NG setup not done
07:38:05.798 [RRC] DL 0004 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:07.070 [PHY] UL    - 01    -  674.19 PRACH: sequence_index=0 ta=4 prb=7:12 symb=2:12 snr=16.6
07:38:07.078 [RRC] UL 0005 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '101010111110000101000111100001010000100'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:07.078 [RRC] -  0005 01 RRC setup request: NG setup not done
07:38:07.078 [RRC] DL 0005 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:08.350 [PHY] UL    - 01    -  802.19 PRACH: sequence_index=6 ta=5 prb=7:12 symb=2:12 snr=16.8
07:38:08.358 [RRC] UL 0006 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '000101110010111100001001100100000110100'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:08.358 [RRC] -  0006 01 RRC setup request: NG setup not done
07:38:08.358 [RRC] DL 0006 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:09.630 [PHY] UL    - 01    -  930.19 PRACH: sequence_index=1 ta=5 prb=7:12 symb=2:12 snr=17.4
07:38:09.639 [RRC] UL 0007 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '010010110111101011111111000101110000111'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:09.639 [RRC] -  0007 01 RRC setup request: NG setup not done
07:38:09.639 [RRC] DL 0007 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:10.921 [PHY] UL    - 01    -   35.19 PRACH: sequence_index=4 ta=6 prb=7:12 symb=2:12 snr=17.2
07:38:10.929 [RRC] UL 0008 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '010101011011110100100000111111011001001'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:10.929 [RRC] -  0008 01 RRC setup request: NG setup not done
07:38:10.929 [RRC] DL 0008 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:12.191 [PHY] UL    - 01    -  162.19 PRACH: sequence_index=5 ta=4 prb=7:12 symb=2:12 snr=15.9
07:38:12.199 [RRC] UL 0009 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '111110011001100111100100100100010101001'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:12.199 [RRC] -  0009 01 RRC setup request: NG setup not done
07:38:12.199 [RRC] DL 0009 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:13.471 [PHY] UL    - 01    -  290.19 PRACH: sequence_index=6 ta=5 prb=7:12 symb=2:12 snr=16.2
07:38:13.479 [RRC] UL 000a 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '000100111011110011010001101011010111000'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:13.479 [RRC] -  000a 01 RRC setup request: NG setup not done
07:38:13.479 [RRC] DL 000a 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:14.751 [PHY] UL    - 01    -  418.19 PRACH: sequence_index=2 ta=5 prb=7:12 symb=2:12 snr=16.8
07:38:14.759 [RRC] UL 000b 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '000100010001010101111101000001100001000'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:14.759 [RRC] -  000b 01 RRC setup request: NG setup not done
07:38:14.759 [RRC] DL 000b 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:16.032 [PHY] UL    - 01    -  546.19 PRACH: sequence_index=6 ta=5 prb=7:12 symb=2:12 snr=16.8
07:38:16.039 [RRC] UL 000c 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '001001011111000111011111111000011110100'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:16.039 [RRC] -  000c 01 RRC setup request: NG setup not done
07:38:16.039 [RRC] DL 000c 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:17.311 [PHY] UL    - 01    -  674.19 PRACH: sequence_index=6 ta=5 prb=7:12 symb=2:12 snr=17.0
07:38:17.320 [RRC] UL 000d 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '011001011110111011010100011110000010001'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:17.320 [RRC] -  000d 01 RRC setup request: NG setup not done
07:38:17.320 [RRC] DL 000d 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:18.602 [PHY] UL    - 01    -  803.19 PRACH: sequence_index=6 ta=6 prb=7:12 symb=2:12 snr=17.1
07:38:18.610 [RRC] UL 000e 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '110010100011000111101111100010111011001'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:18.610 [RRC] -  000e 01 RRC setup request: NG setup not done
07:38:18.610 [RRC] DL 000e 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:19.872 [PHY] UL    - 01    -  930.19 PRACH: sequence_index=4 ta=4 prb=7:12 symb=2:12 snr=17.0
07:38:19.880 [RRC] UL 000f 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '111111011101011100011100010100000010101'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:19.880 [RRC] -  000f 01 RRC setup request: NG setup not done
07:38:19.880 [RRC] DL 000f 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:21.152 [PHY] UL    - 01    -   34.19 PRACH: sequence_index=2 ta=6 prb=7:12 symb=2:12 snr=17.4
07:38:21.160 [RRC] UL 0010 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '100000000111111001100100110111011110011'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:21.160 [RRC] -  0010 01 RRC setup request: NG setup not done
07:38:21.160 [RRC] DL 0010 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:22.432 [PHY] UL    - 01    -  162.19 PRACH: sequence_index=7 ta=5 prb=7:12 symb=2:12 snr=17.4
07:38:22.440 [RRC] UL 0011 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '101011101100001110110000001000000010011'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:22.440 [RRC] -  0011 01 RRC setup request: NG setup not done
07:38:22.440 [RRC] DL 0011 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:23.712 [PHY] UL    - 01    -  290.19 PRACH: sequence_index=2 ta=5 prb=7:12 symb=2:12 snr=17.0
07:38:23.720 [RRC] UL 0012 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '010001011011011010010101001100011110101'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:23.720 [RRC] -  0012 01 RRC setup request: NG setup not done
07:38:23.720 [RRC] DL 0012 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:24.992 [PHY] UL    - 01    -  418.19 PRACH: sequence_index=3 ta=5 prb=7:12 symb=2:12 snr=16.5
07:38:25.000 [RRC] UL 0013 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '100101101111110000011110001100110101101'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:25.000 [RRC] -  0013 01 RRC setup request: NG setup not done
07:38:25.000 [RRC] DL 0013 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:26.282 [PHY] UL    - 01    -  547.19 PRACH: sequence_index=0 ta=6 prb=7:12 symb=2:12 snr=16.4
07:38:26.290 [RRC] UL 0014 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '101110011110111100011000010100111101101'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:26.290 [RRC] -  0014 01 RRC setup request: NG setup not done
07:38:26.290 [RRC] DL 0014 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:27.552 [PHY] UL    - 01    -  674.19 PRACH: sequence_index=4 ta=5 prb=7:12 symb=2:12 snr=16.5
07:38:27.560 [RRC] UL 0015 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '101010111100011001111011000010001010110'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:27.560 [RRC] -  0015 01 RRC setup request: NG setup not done
07:38:27.560 [RRC] DL 0015 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:28.832 [PHY] UL    - 01    -  802.19 PRACH: sequence_index=1 ta=4 prb=7:12 symb=2:12 snr=16.8
07:38:28.840 [RRC] UL 0016 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '111110110101100101101101111100111010000'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:28.840 [RRC] -  0016 01 RRC setup request: NG setup not done
07:38:28.840 [RRC] DL 0016 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:30.112 [PHY] UL    - 01    -  930.19 PRACH: sequence_index=0 ta=5 prb=7:12 symb=2:12 snr=16.2
07:38:30.121 [RRC] UL 0017 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '101100101101111110000111010100011100110'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:30.121 [RRC] -  0017 01 RRC setup request: NG setup not done
07:38:30.121 [RRC] DL 0017 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:31.393 [PHY] UL    - 01    -   34.19 PRACH: sequence_index=0 ta=5 prb=7:12 symb=2:12 snr=15.8
07:38:31.401 [RRC] UL 0018 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '000001001010100010111100000111000001100'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:31.401 [RRC] -  0018 01 RRC setup request: NG setup not done
07:38:31.401 [RRC] DL 0018 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:32.528 [NGAP] -  Connecting to 127.0.1.100:38412
07:38:32.528 [NGAP] -  Connect error (code=111)
07:38:32.528 [NGAP] -  Disconnected
07:38:32.673 [PHY] UL    - 01    -  162.19 PRACH: sequence_index=1 ta=5 prb=7:12 symb=2:12 snr=16.5
07:38:32.681 [RRC] UL 0019 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '001011110101000010010110101101001110110'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:32.681 [RRC] -  0019 01 RRC setup request: NG setup not done
07:38:32.681 [RRC] DL 0019 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:33.963 [PHY] UL    - 01    -  291.19 PRACH: sequence_index=7 ta=6 prb=7:12 symb=2:12 snr=16.4
07:38:33.971 [RRC] UL 001a 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '010101010100100000010101110010000110010'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:33.971 [RRC] -  001a 01 RRC setup request: NG setup not done
07:38:33.971 [RRC] DL 001a 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:35.233 [PHY] UL    - 01    -  418.19 PRACH: sequence_index=6 ta=5 prb=7:12 symb=2:12 snr=16.1
07:38:35.241 [RRC] UL 001b 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '000011010100110010001111001111111110001'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:35.241 [RRC] -  001b 01 RRC setup request: NG setup not done
07:38:35.241 [RRC] DL 001b 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:36.513 [PHY] UL    - 01    -  546.19 PRACH: sequence_index=5 ta=6 prb=7:12 symb=2:12 snr=16.3
07:38:36.521 [RRC] UL 001c 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '001100100000100000010110101010101100111'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:36.521 [RRC] -  001c 01 RRC setup request: NG setup not done
07:38:36.521 [RRC] DL 001c 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:37.793 [PHY] UL    - 01    -  674.19 PRACH: sequence_index=4 ta=5 prb=7:12 symb=2:12 snr=16.9
07:38:37.801 [RRC] UL 001d 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '001110011010110011111001010101011101100'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }

07:38:37.801 [RRC] -  001d 01 RRC setup request: NG setup not done
07:38:37.801 [RRC] DL 001d 01 CCCH-NR: RRC reject
        {
          message c1: rrcReject: {
            criticalExtensions rrcReject: {
            }
          }
        }

07:38:39.073 [PHY] UL    - 01    -  802.19 PRACH: sequence_index=2 ta=5 prb=7:12 symb=2:12 snr=16.4
07:38:39.081 [RRC] UL 001e 01 CCCH-NR: RRC setup request
        {
          message c1: rrcSetupRequest: {
            rrcSetupRequest {
              ue-Identity randomValue: '010101110010010000011110010111011110101'B,
              establishmentCause mo-Signalling,
              spare '0'B
            }
          }
        }
  `;
  return (
    <Container maxWidth="xl">
      <Toolbar>
        <Box style={{ padding: "0 10px" }}>
          <SyntaxHighlighter language="javascript" style={docco}>
            {codeString}
          </SyntaxHighlighter>
        </Box>
      </Toolbar>
    </Container>
  );
};

export default MonitorLogs;
