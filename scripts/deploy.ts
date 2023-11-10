import { ethers } from "hardhat";
import { EnclaveIdStruct, TCBInfoStruct } from "../typechain-types/contracts/AutomataDcapV3Attestation";
import fs from 'fs';

async function main() {
  const sigVerifyLib = await ethers.deployContract("SigVerifyLib", [], {});
  await sigVerifyLib.waitForDeployment();
  const sigVerifyLibAddr = await sigVerifyLib.getAddress();
  console.log("sigVerifyLib address:", sigVerifyLibAddr);
  const attestation = await ethers.deployContract("AutomataDcapV3Attestation", [sigVerifyLibAddr], {});
  await attestation.waitForDeployment();
  const attestationAddr = await attestation.getAddress();
  console.log("attestation address:", attestationAddr);

  {
    var enclaveId = parseEnclaveId();
    await attestation.configureQeIdentityJson(enclaveId);
    console.log("configureQeIdentityJson");
  }

  {
    const tcbInfo = parseTcbInfo();
    await attestation.configureTcbInfoJson(tcbInfo.fmspc, tcbInfo);
    console.log("configureTcbInfoJson");
  }

    const quote = '0x030002000000000009000e00939a7233f79c4ca9940a0db3957f0607ccb12a326354d33986ff47365f17ad4c000000000c0c100fffff0100000000000000000000000000000000000000000000000000000000000000000000000000000000000700000000000000e70000000000000046049af725ec3986eeb788693df7bc5f14d3f2705106a19cd09b9d89237db1a00000000000000000000000000000000000000000000000000000000000000000ef69011f29043f084e99ce420bfebdfa410aee1e132014e7ceff29efa9659bd90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ca10000084af1f392be216944059f3fa05bf91e1b4e9b513c67493521eb4488af35f49c8f300d57955afc1df97d423c8718ed5b0af82f71047a229df221faa6817ad5daa44131b5c2ed877295959f7333543ba3f17994d767da194a27ba7a4e8a71940118a138dce8499572433c2cc4e4312f92e7144b26f84c59022bfc9aea59967f00d0c0c100fffff0100000000000000000000000000000000000000000000000000000000000000000000000000000000001500000000000000e700000000000000192aa50ce1c0cef03ccf89e7b5b16b0d7978f5c2b1edcf774d87702e8154d8bf00000000000000000000000000000000000000000000000000000000000000008c4f5775d796503e96137f77c68a829a0056ac8ded70140b081b094490c57bff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a654bcd78ffaa5cfc888fc90cbc24fb7f6e19bc8661671f1e3b2cc947db3b6340000000000000000000000000000000000000000000000000000000000000000839adce904d2aec1fc021ad0ec370c7176942d4b64939b95a2e1e1d3e09bf2e57093231f4308b64e8f53b81cd6ae36fc52f202e66ac77b93b13307ee577be36b2000000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f0500620e00002d2d2d2d2d424547494e2043455254494649434154452d2d2d2d2d0a4d494945386a4343424a696741774942416749554b6e314f2b2b58517264456161433535634a4c307470464867336b77436759494b6f5a497a6a3045417749770a634445694d434147413155454177775a535735305a577767553064594946424453794251624746305a6d397962534244515445614d42674741315545436777520a535735305a577767513239796347397959585270623234784644415342674e564241634d43314e68626e526849454e7359584a684d51737743515944565151490a44414a445154454c4d416b474131554542684d4356564d774868634e4d6a4d774f4449304d6a45304d444d775768634e4d7a41774f4449304d6a45304d444d770a576a42774d534977494159445651514444426c4a626e526c624342545231676755454e4c49454e6c636e52705a6d6c6a5958526c4d526f77474159445651514b0a4442464a626e526c6243424462334a7762334a6864476c76626a45554d424947413155454277774c553246756447456751327868636d4578437a414a42674e560a4241674d416b4e424d517377435159445651514745774a56557a425a4d424d4742797147534d34394167454743437147534d34394177454841304941424e47520a727a716c416d4a66617756324b67656a39576e774a736666457868445631756847396e6d57377430505a646e6276732f6c677872584255625657436d5043456f0a4f49587768563673736d6e6b6b48462b576d536a67674d4f4d494944436a416642674e5648534d4547444157674253566231334e765276683655424a796454300a4d383442567776655644427242674e56485238455a4442694d47436758714263686c706f64485277637a6f764c32467761533530636e567a6447566b633256790a646d6c6a5a584d75615735305a577775593239744c334e6e6543396a5a584a3061575a7059324630615739754c33597a4c33426a61324e796244396a595431770a624746305a6d397962535a6c626d4e765a476c755a7a316b5a584977485159445652304f424259454641337234524b62476e54316e584c775a5a7272515559410a4a6b776c4d41344741315564447745422f775145417749477744414d42674e5648524d4241663845416a41414d4949434f77594a4b6f5a496876684e415130420a424949434c444343416967774867594b4b6f5a496876684e415130424151515179753373424e6d7632566643337932772f445344627a434341575547436971470a534962345451454e41514977676746564d42414743797147534962345451454e415149424167454d4d42414743797147534962345451454e415149434167454d0a4d42414743797147534962345451454e41514944416745444d42414743797147534962345451454e41514945416745444d42454743797147534962345451454e0a41514946416749412f7a415242677371686b69472b4530424451454342674943415038774541594c4b6f5a496876684e4151304241676343415145774541594c0a4b6f5a496876684e4151304241676743415141774541594c4b6f5a496876684e4151304241676b43415141774541594c4b6f5a496876684e4151304241676f430a415141774541594c4b6f5a496876684e4151304241677343415141774541594c4b6f5a496876684e4151304241677743415141774541594c4b6f5a496876684e0a4151304241673043415141774541594c4b6f5a496876684e4151304241673443415141774541594c4b6f5a496876684e4151304241673843415141774541594c0a4b6f5a496876684e4151304241684143415141774541594c4b6f5a496876684e4151304241684543415130774877594c4b6f5a496876684e41513042416849450a4541774d4177502f2f7745414141414141414141414141774541594b4b6f5a496876684e4151304241775143414141774641594b4b6f5a496876684e415130420a4241514741474271414141414d41384743697147534962345451454e4151554b415145774867594b4b6f5a496876684e415130424267515136657645326f42790a6f684e362f30727741346d642b6a424542676f71686b69472b453042445145484d4459774541594c4b6f5a496876684e4151304242774542416638774541594c0a4b6f5a496876684e4151304242774942415141774541594c4b6f5a496876684e4151304242774d4241514177436759494b6f5a497a6a304541774944534141770a52514967522b344377346437476a73684848436c7a394c6269785a4a45632f31666c7a734449504d5451437a2b43304349514430516e6d514c2b4e6b4e374a7a0a655a666c5078644734687a374b652b3443595366744b416a48545a7539413d3d0a2d2d2d2d2d454e442043455254494649434154452d2d2d2d2d0a2d2d2d2d2d424547494e2043455254494649434154452d2d2d2d2d0a4d4949436c6a4343416a32674177494241674956414a567658633239472b487051456e4a3150517a7a674658433935554d416f4743437147534d343942414d430a4d476778476a415942674e5642414d4d45556c756447567349464e48574342536232393049454e424d526f77474159445651514b4442464a626e526c624342440a62334a7762334a6864476c76626a45554d424947413155454277774c553246756447456751327868636d4578437a414a42674e564241674d416b4e424d5173770a435159445651514745774a56557a4165467730784f4441314d6a45784d4455774d5442614677307a4d7a41314d6a45784d4455774d5442614d484178496a41670a42674e5642414d4d47556c756447567349464e4857434251513073675547786864475a76636d306751304578476a415942674e5642416f4d45556c75644756730a49454e76636e4276636d4630615739754d5251774567594456515148444174545957353059534244624746795954454c4d416b474131554543417743513045780a437a414a42674e5642415954416c56544d466b77457759484b6f5a497a6a3043415159494b6f5a497a6a304441516344516741454e53422f377432316c58534f0a3243757a7078773734654a423732457944476757357258437478327456544c7136684b6b367a2b5569525a436e71523770734f766771466553786c6d546c4a6c0a65546d693257597a33714f42757a43427544416642674e5648534d4547444157674251695a517a575770303069664f44744a5653763141624f536347724442530a42674e5648523845537a424a4d45656752614244686b466f64485277637a6f764c324e6c636e52705a6d6c6a5958526c63793530636e567a6447566b633256790a646d6c6a5a584d75615735305a577775593239744c306c756447567355306459556d397664454e424c6d526c636a416442674e5648513445466751556c5739640a7a62306234656c4153636e553944504f4156634c336c517744675944565230504151482f42415144416745474d42494741315564457745422f7751494d4159420a4166384341514177436759494b6f5a497a6a30454177494452774177524149675873566b6930772b6936565947573355462f32327561586530594a446a3155650a6e412b546a44316169356343494359623153416d4435786b66545670766f34556f79695359787244574c6d5552344349394e4b7966504e2b0a2d2d2d2d2d454e442043455254494649434154452d2d2d2d2d0a2d2d2d2d2d424547494e2043455254494649434154452d2d2d2d2d0a4d4949436a7a4343416a53674177494241674955496d554d316c71644e496e7a6737535655723951477a6b6e42717777436759494b6f5a497a6a3045417749770a614445614d4267474131554541777752535735305a5777675530645949464a766233516751304578476a415942674e5642416f4d45556c756447567349454e760a636e4276636d4630615739754d5251774567594456515148444174545957353059534244624746795954454c4d416b47413155454341774351304578437a414a0a42674e5642415954416c56544d423458445445344d4455794d5445774e4455784d466f58445451354d54497a4d54497a4e546b314f566f77614445614d4267470a4131554541777752535735305a5777675530645949464a766233516751304578476a415942674e5642416f4d45556c756447567349454e76636e4276636d46300a615739754d5251774567594456515148444174545957353059534244624746795954454c4d416b47413155454341774351304578437a414a42674e56424159540a416c56544d466b77457759484b6f5a497a6a3043415159494b6f5a497a6a3044415163445167414543366e45774d4449595a4f6a2f69505773437a61454b69370a314f694f534c52466857476a626e42564a66566e6b59347533496a6b4459594c304d784f346d717379596a6c42616c54565978465032734a424b357a6c4b4f420a757a43427544416642674e5648534d4547444157674251695a517a575770303069664f44744a5653763141624f5363477244425342674e5648523845537a424a0a4d45656752614244686b466f64485277637a6f764c324e6c636e52705a6d6c6a5958526c63793530636e567a6447566b63325679646d6c6a5a584d75615735300a5a577775593239744c306c756447567355306459556d397664454e424c6d526c636a416442674e564851344546675155496d554d316c71644e496e7a673753560a55723951477a6b6e4271777744675944565230504151482f42415144416745474d42494741315564457745422f7751494d4159424166384341514577436759490a4b6f5a497a6a3045417749445351417752674968414f572f35516b522b533943695344634e6f6f774c7550524c735747662f59693747535839344267775477670a41694541344a306c72486f4d732b586f356f2f7358364f39515778485241765a55474f6452513763767152586171493d0a2d2d2d2d2d454e442043455254494649434154452d2d2d2d2d0a00';
    let tx = await attestation.verifyAttestation(quote);
    console.log(tx)
}

function parseEnclaveId(): EnclaveIdStruct.EnclaveIdStruct {
  const fileContent = fs.readFileSync('contracts/assets/identity.json', 'utf8');
  const obj = JSON.parse(fileContent);
  var enclaveId = obj.enclaveIdentity as EnclaveIdStruct.EnclaveIdStruct;
  enclaveId.miscselect = "0x" + enclaveId.miscselect;
  enclaveId.miscselectMask = "0x" + enclaveId.miscselectMask;
  enclaveId.attributes = "0x" + enclaveId.attributes;
  enclaveId.attributesMask = "0x" + enclaveId.attributesMask;
  enclaveId.mrsigner = "0x" + enclaveId.mrsigner;
  for (var i in enclaveId.tcbLevels) {
    if (enclaveId.tcbLevels[i].tcbStatus == "UpToDate") {
      enclaveId.tcbLevels[i].tcbStatus = 0;
    } else {
      enclaveId.tcbLevels[i].tcbStatus = 1;
    }
  }
  return enclaveId;
}

function parseTcbInfo(): TCBInfoStruct.TCBInfoStruct {
  const fileContent = fs.readFileSync('contracts/assets/tcbInfo.json', 'utf8');
  const obj = JSON.parse(fileContent);
  var tcbInfo = obj.tcbInfo as TCBInfoStruct.TCBInfoStruct;
  const fmspc = obj.tcbInfo.fmspc;;
  tcbInfo.pceid = tcbInfo.pceId;
  for (var i in tcbInfo.tcbLevels) {
    var tcb = tcbInfo.tcbLevels[i];

    tcb.sgxTcbCompSvnArr = [];
    for (var k in tcb.tcb) {
      if (k == "pcesvn") {
        tcb.pcesvn = tcb.tcb[k];
      } else {
        tcb.sgxTcbCompSvnArr.push(tcb.tcb[k]);
      }
    }
    tcb.status = "OK";
    if (tcb.tcbStatus == "UpToDate") {
      tcb.status = 0; // "OK";
    } else if (tcb.tcbStatus == "SWHardeningNeeded") {
      tcb.status = 1; // "TCB_SW_HARDENING_NEEDED";
    } else if (tcb.tcbStatus == "ConfigurationAndSWHardeningNeeded") {
      tcb.status = 2; // "TCB_CONFIGURATION_AND_SW_HARDENING_NEEDED";
    } else if (tcb.tcbStatus == "ConfigurationNeeded") {
      tcb.status = 3; // "TCB_CONFIGURATION_NEEDED";
    } else if (tcb.tcbStatus == "OutOfDate") {
      tcb.status = 4; // "TCB_OUT_OF_DATE";
    } else if (tcb.tcbStatus == "OutOfDateConfigurationNeeded") {
      tcb.status = 5; // "TCB_OUT_OF_DATE_CONFIGURATION_NEEDED";
    } else if (tcb.tcbStatus == "Revoked") {
      tcb.status = 6; // "TCB_REVOKED";
    }
  }
  return tcbInfo;
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
