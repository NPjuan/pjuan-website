import { ref } from 'vue';
import { read, utils, writeFileXLSX } from 'xlsx';
import * as moment from 'moment';

interface Line {
  '打卡1'?: string;
  '打卡2'?: string;
  '打卡3'?: string;
  '打卡4'?: string;
  '打卡5'?: string;
  '打卡6'?: string;

}
export default function useReadXLXS() {
  const file = ref<File | String>('')
  const loading = ref<Boolean>(false);
  const xlsx = ref<any>(null);
  const xlsxCache = localStorage.getItem('xlsx')
  if (xlsxCache) {
    xlsx.value = JSON.parse(xlsxCache);
  }
  const readXLSXFile = async (event: any, callback: (xlsx: any) => void) => {
    loading.value = true;
  
    const file = event?.target?.files[0]
    file.value = file
  
    const arrayBuffer = await file.arrayBuffer();
    xlsx.value = read(arrayBuffer);

    // localStorage.setItem('xlsx', JSON.stringify(xlsx));
    // const sheet = xlsx.Sheets[xlsx.SheetNames[0]]
    // const sheetJson = utils.sheet_to_json(sheet)
    loading.value = false
    // console.log('xlsx', sheetJson)

    callback && callback(xlsx.value);
    
  }

  const chanegLoading = () => {
    loading.value = !loading.value
  }

  return {
    file,
    xlsx,
    loading,
    readXLSXFile,
    chanegLoading
  }
}