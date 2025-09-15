import Hangul from 'hangul-js';

// 한글 자모를 영어 키보드 배열로 변환하는 맵핑 (두벌식 키보드 기준)
const koreanToEnglishMap: { [key: string]: string } = {
  // 한글 자음
  'ㄱ': 'r', 'ㄲ': 'R', 'ㄴ': 's', 'ㄷ': 'e', 'ㄸ': 'E',
  'ㄹ': 'f', 'ㅁ': 'a', 'ㅂ': 'q', 'ㅃ': 'Q', 'ㅅ': 't',
  'ㅆ': 'T', 'ㅇ': 'd', 'ㅈ': 'w', 'ㅉ': 'W', 'ㅊ': 'c',
  'ㅋ': 'z', 'ㅌ': 'x', 'ㅍ': 'v', 'ㅎ': 'g',
  
  // 한글 모음
  'ㅏ': 'k', 'ㅐ': 'o', 'ㅑ': 'i', 'ㅒ': 'O', 'ㅓ': 'j',
  'ㅔ': 'p', 'ㅕ': 'u', 'ㅖ': 'P', 'ㅗ': 'h', 'ㅘ': 'hk',
  'ㅙ': 'ho', 'ㅚ': 'hl', 'ㅛ': 'y', 'ㅜ': 'n', 'ㅝ': 'nj',
  'ㅞ': 'np', 'ㅟ': 'nl', 'ㅠ': 'b', 'ㅡ': 'm', 'ㅢ': 'ml',
  'ㅣ': 'l',
};

/**
 * 한글 문자를 영어 키보드 배열로 변환 (hangul-js 라이브러리 사용)
 * @param text 변환할 한글 텍스트
 * @returns 영어로 변환된 텍스트
 */
export function convertKoreanToEnglish(text: string): string {
  return text
    .split('')
    .map(char => {
      // 한글 문자인지 확인
      if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(char)) {
        // hangul-js를 사용하여 자모 분리
        const disassembled = Hangul.disassemble(char);
        
        // 분리된 자모를 영어로 변환
        return disassembled
          .map(jamo => koreanToEnglishMap[jamo] || jamo)
          .join('');
      }
      
      // 한글이 아닌 문자는 그대로 반환
      return char;
    })
    .join('');
}