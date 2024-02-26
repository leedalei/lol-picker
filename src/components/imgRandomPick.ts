import pic1 from '@/assets/1.jpg'

const images = [
  pic1,
]


export const getRandom = ()=>{
  return images[Math.round(Math.random()*1)]
}