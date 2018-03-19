#define _CRT_SECURE_NO_WARNINGS    // scanf 보안 경고로 인한 컴파일 에러 방지
#include <stdio.h>
int main()
{
    int num1;
    int num2;
    printf("두개의 정수를 입력하세요");
    printf("\n num1:");
    scanf("%d", &num1);    // 표준 입력을 받아서 변수에 저장
    printf("num2:");
    scanf("%d", &num2);    // 표준 입력을 받아서 변수에 저장
    
    
    printf("입력값은 %d과 %d 입니다\n", num1, num2);    // 변수의 내용을 출력
    return 0;
}