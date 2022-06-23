const node_xj = require('xls-to-json');
const FileType = require('file-type');
const fetch = require('node-fetch');
const converter = require('json-2-csv');
const fs = require('fs');


// upload();
checkAttachments();
const Systems = {
  'Tractor System': {
    id: 1,
    subsystem: {
      'ACCELERATOR ASSY': 1,
      'INTEGRATION AIR INTAKE ASSY': 2,
      'BRAKE LINKAGE ASSY': 3,
      'INTEGRATION COOLING ASSY': 4,
      'CLUTCH PEDAL ASSY': 5,
      'CONSUMABLES TRACTOR': 6,
    },
  },
  'Sheetmetal System': {
    id: 2,
    subsystem: {
      BRACKETORIES: 7,
      'BATTERY MOUNTING ASSY': 8,
      ENVELOPE: 9,
      ERGONOMICS: 10,
      'FLOOR PANELS': 11,
      'FENDER ASSEMBLY': 12,
    },
  },
  'Transmission System': {
    id: 3,
    subsystem: {
      'BULLCAGE ASSEMBLY': 13,
      'BRAKE ASSY': 14,
      'CONSUMABLES TRANSMISSION': 15,
      'DIFFERENTIAL CASE SUB ASSY': 16,
      'DIFFERENTIAL LOCK SUB ASSY': 17,
      ENVELOPE: 18,
    },
  },
  'Hydraulic System': {
    id: 4,
    subsystem: {
      'BELL CRANK ASSY': 19,
      'CONSUMABLES HYDRAULICS': 20,
      'CONTROL VALVE ASSY': 21,
      'DC SENSING ASSY': 22,
      ENVELOPE: 23,
      'HYDRAULIC PIPE ASSY': 24,
    },
  },
  'Engine System': {
    id: 5,
    subsystem: {
      'AIR INTAKE SYSTEM': 25,
      'CRANKCASE ASSEMBLY': 26,
      'CYLINDER HEAD ASSY': 27,
      'COOLING SYSTEM': 28,
      CONSUMABLES: 29,
      'CRANK TRAIN SYSTEM': 30,
    },
  },
  'Electrical System': {
    id: 6,
    subsystem: {
      'BATTERY ASSY': 31,
      'CLUSTER ASSY': 32,
      CONSUMABLES: 33,
      'ECU ASSY': 34,
      ENVELOPE: 35,
      'FRONT P&T LAMP ASSY': 36,
    },
  },
  'Advance Engineering': {
    id: 7,
    subsystem: {
      'Application Engineering': 37,
    },
  },
  NA: {
    id: 8,
    subsystem: {
      NA: 38,
    },
  },
};
const mimetypes = {
  pdf: 'application/pdf',
  PDF: 'application/pdf',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};
function getDivisionId(division) {
  // const Divisions = ['FD', 'AD']
  if (division === 'AD' || division === 'AS') {
    return 2;
  } else {
    return 1;
  }
}

function getPlatformId(platform) {
  // const platforms = ['Novo', 'Yuvo', 'Jivo', 'Yuvraj', 'Others', 'NA'];
  const inputPlatform = platform.toLowerCase().trim();

  if (
    inputPlatform == 'mstar' ||
    inputPlatform == 'm-star' ||
    inputPlatform == 'compact'
  ) {
    return 1;
  } else if (
    inputPlatform == 'yuvraj' ||
    inputPlatform == 'h1' ||
    inputPlatform == 'h2' ||
    inputPlatform == 'h3' ||
    inputPlatform == 'mpower' ||
    inputPlatform == 'dhruv' ||
    inputPlatform == 'yuvraj 215'
  ) {
    return 2;
  } else if (inputPlatform == 'yuvraj nxt') {
    return 3;
  } else if (inputPlatform) {
    return 4;
  } else {
    return 5;
  }
}

function getSystemId(system) {
  return Systems[system] ? Systems[system].id : 8;
}

function getSubsystemId(system, subsystem) {
  return Systems[system]
    ? Systems[system][subsystem]
      ? Systems[system][subsystem]
      : 38
    : 8;
}

async function getFileType(file) {
  // const file = rec.attachment.split('.');
  // const fileType = file[file.length - 1];
  // return fileType ? mimetypes[fileType] : '';
}

function upload() {
  node_xj(
    {
      input: 'Knowledge Creation Batch 1 upload.xlsx', // input xls
      output: 'output.json', // output json
      sheet: 'Sheet1', // specific sheetname
    },
    function (err, result) {
      if (err) {
        console.error(err);
      } else {
        // console.log(result);
        const updatedData = [];
        result.forEach((data, index) => {
          const record = {
            creator: 'Amit Daigavane',
            title: data.title,
            description: data.description,
            division_id: getDivisionId(data.division_id),
            platform_id: getPlatformId(data.platform_id), // changes accordingly
            system_id: getSystemId(data.system_id),
            subsystem_id: getSubsystemId(data.system_id, data.subsystem_id),
            tag: null,
            attachment: data.attachment
              ? `https://kmsmediasvcstorage.blob.core.windows.net/knowledge/${data.attachment}`
              : '',
            created_date: data.created_date
              ? new Date(data.created_date)
              : new Date(),
            updated_date: new Date(),
            upvotes: null,
            created_by_id: '23066139', // need to check
            isKnowledge: 1,
            attachment_file_type: getFileType(data.attachment),
            nameofposition: 'Assistant Manager - KNOWL', // get it from details
            video_id: '',
            transcription_data: '',
            thumbnailId: '',
            knowledge_creationcol: null,
            status: 0,
            expertise_name: null,
            expertise_id: null,
          };
          updatedData.push(record);
          console.log('Done', index + 1);
          
        });
        // converter.json2csv(updatedData, (err, csv) => {
        //   if (err) {
        //     console.log(err);
        //   }
        //   fs.writeFile('Knowledge.csv', csv, (err) => {
        //     if (err) throw err;
        //     console.log('Knowledge File created');
        //   });
        // });
      }
    }
  );
}
function checkAttachments() {
  node_xj(
    {
      input: 'Knowledge Creation Batch 1 upload.xlsx', // input xls
      output: 'output.json', // output json
      sheet: 'Data', // specific sheetname
    },
    function (err, result) {
      if(err) {
        console.log(err);
      } else {
        const types = []
        result.forEach((rec) => {
          if (rec.attachment) {
            const file = rec.attachment.split('.');
            const fileType = file[file.length - 1];
            if (types.indexOf(fileType) === -1) {
              types.push(fileType);
            }
          }
        });
        console.log(types);
      }
    });
}
