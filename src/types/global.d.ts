import { KaboomConf, KaboomCtx } from "~kaboom";

declare interface Window {
    kaboom: (conf?: KaboomConf) => KaboomCtx
}

declare const kaboom: (conf?: KaboomConf) => KaboomCtx;
