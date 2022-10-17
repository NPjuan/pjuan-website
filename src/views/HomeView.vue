<script setup lang="ts">
import { ref } from 'vue'
import moment from 'moment';
import { utils, writeFile } from 'xlsx';
import useReadXLSX from '../compose/useReadXLSX';


const { loading, xlsx, readXLSXFile, chanegLoading } = useReadXLSX()
const resultFile = ref<any>(null);

function dealXLSX() {
  if (!xlsx.value) return;
  for (const sheetName of xlsx.value.SheetNames) {
    if (sheetName === '原始数据') {
      const sheet = xlsx.value.Sheets[sheetName]
      const sheetJson = utils.sheet_to_json(sheet)
      const handledSheetJson = sheetJson.map((line: any) => {
        const { 
          打卡1: moringOnWorkPunch, 
          打卡2: moringOffWorkPunch,
          打卡3: afternoonOnWorkPunch,
          打卡4: afternoonOffWorkPunch,
          打卡5: nightOnWorkPunch,
          打卡6: nightOffWorkPunch,
          姓名: name,
        } = line

        const moringWorkingHours = workingHoursCalc(moringOnWorkPunch, moringOffWorkPunch, 3.5)
        const afternoonWorkingHours = workingHoursCalc(afternoonOnWorkPunch, afternoonOffWorkPunch)
        const nigthWorkingHours = workingHoursCalc(nightOnWorkPunch, nightOffWorkPunch)
        const totalWorkingHours = moringWorkingHours + afternoonWorkingHours + nigthWorkingHours
        console.log(`姓名：${name}`)
        console.log(`早班打卡时长： ${moringOnWorkPunch} - ${moringOffWorkPunch} - ${moringWorkingHours}`)
        console.log(`午班打卡时长： ${afternoonWorkingHours}`)
        console.log(`晚班打卡时长： ${nigthWorkingHours}`)
        console.log(`总工作时长：${totalWorkingHours}`)
        console.log(' --------- ')
        line['工时'] = totalWorkingHours

        return line

        // console.log('moringOnWorkPunch', moringOnWorkPunch)
      })
      xlsx.value.Sheets[sheetName] = utils.json_to_sheet(handledSheetJson)
      const result = utils.json_to_sheet(handledSheetJson);
      writeFile(xlsx.value, `${sheetName}.xlsx`)

      console.log('result', result);
    }
  }
}


function workingHoursCalc(startStringTime: moment.MomentInput, endStringTime: moment.MomentInput, maxOutput?: number): number {
  if (!startStringTime || !endStringTime) return 0

  const startTime = moment(startStringTime, 'hh:mm')
  const endTime = moment(endStringTime, 'hh:mm')

  const minutes = endTime.diff(startTime, 'minute');
  const carry = minutes % 60 >= 45 ? 1 : minutes % 60 >= 15 ? 0.5 : 0
  const result = Math.floor(minutes / 60)

  if (maxOutput) {
    return result + carry > maxOutput ? maxOutput : result + carry
  }
  return result + carry
}

function mockClickUploadInput() {
  const uploadInputEl = document.querySelector('#XLSXFileReader') as HTMLElement
  try {
    uploadInputEl.click();
  } catch(err) {
    console.log(err)
  }
}
</script>

<template>
  <main>
    <input 
      type="file" 
      name="XLSXFileReader" 
      id="XLSXFileReader" 
      @change="readXLSXFile($event, dealXLSX)" 
    />
    <div class="upload-container" @click="mockClickUploadInput">
      <div>上传文件</div>
    </div>
    <!-- <div class="upload-tips">{{ xlsx ? '可以导出数据了' : '请先上传文件' }}</div> -->
  </main>
</template>

<style scoped>
.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 150px;
  background-color: #42b883;
  font-size: 36px;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  margin: auto;
}
.upload-tips {
  font-size: 16px;
  margin: auto;
  color: #42b883;
  text-align: center;
  margin-top: 10px;
  width: 200px;
}
 #XLSXFileReader {
   display: block;
   cursor: pointer;
   width: 200px;
   height: 60px;
   border-radius: 6px;
   background-color: beige;
   opacity: 0;
 }
</style>
