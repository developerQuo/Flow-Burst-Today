# 프로젝트 구조 (Turborepo Monorepo 기준)

## 사용 시점

- 모노레포 전환/구조 변경 작업 전
- 새 공용 패키지 추가 전
- CI 경로/워크스페이스 필터를 수정할 때

## 구조 원칙

1. 앱 경로는 `web/`, `mobile/`를 유지한다.
- 현재 전환 범위에서는 `apps/*` 경로 이동을 하지 않는다.

2. 공용 코드는 `packages/*`로만 관리한다.
- 앱 간 직접 import(`web -> mobile`, `mobile -> web`) 금지

3. 현재 필수 공용 패키지는 `packages/shared-types`다.
- 타입 공유 외의 공용 패키지는 필요 증거가 있을 때만 추가한다.

4. 루트에서 monorepo를 제어한다.
- 루트 기준 파일: `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `turbo.json`

## 목표 구조

```text
Flow-Burst-Today/
├── .agent/
│   └── instructions/
│       ├── README.md
│       └── monorepo/
├── .github/
│   └── workflows/
│       ├── node.js.yml
│       └── chromatic.yml
├── mobile/
│   ├── App.tsx
│   ├── index.ts
│   ├── app.json
│   ├── tsconfig.json
│   ├── metro.config.js              # workspace 패키지 import 필요 시 추가
│   └── package.json
├── web/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── actions/
│   ├── store/
│   ├── public/
│   ├── utils/
│   ├── data/
│   ├── .storybook/
│   ├── next.config.mjs
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── package.json
├── packages/
│   └── shared-types/
│       ├── package.json
│       └── src/
│           ├── index.ts
│           └── native-bridge.d.ts
├── package.json                     # 루트 scripts + turbo 엔트리
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── turbo.json
└── README.md
```

## 디렉터리 책임

1. `web/`
- Next.js 런타임/UI/스토리북/웹 테스트

2. `mobile/`
- Expo/RN 런타임/UI/네이티브 연동

3. `packages/shared-types`
- 웹/모바일 브릿지 계약 타입 단일 소스

## 현재 범위 제외

- `apps/*` 경로 이동
- `packages/domain-pomodoro`, `packages/platform-web`, `packages/platform-native`, `packages/design-tokens` 도입

## 참고 문서

1. `monorepo/turborepo-project-management-plan.md`
2. `monorepo/turborepo-build-optimization-plan.md`
3. `monorepo/turborepo-package-dependencies-plan.md`
4. `monorepo/turborepo-shared-modules-plan.md`
5. `monorepo/turborepo-implementation-playbook.md`
