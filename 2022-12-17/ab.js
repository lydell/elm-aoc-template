// elm-watch hot {"version":"1.1.1","targetName":"Day17","webSocketPort":53141}
"use strict";
(() => {
  // node_modules/tiny-decoders/index.mjs
  function boolean(value) {
    if (typeof value !== "boolean") {
      throw new DecoderError({ tag: "boolean", got: value });
    }
    return value;
  }
  function number(value) {
    if (typeof value !== "number") {
      throw new DecoderError({ tag: "number", got: value });
    }
    return value;
  }
  function string(value) {
    if (typeof value !== "string") {
      throw new DecoderError({ tag: "string", got: value });
    }
    return value;
  }
  function stringUnion(mapping) {
    return function stringUnionDecoder(value) {
      const str = string(value);
      if (!Object.prototype.hasOwnProperty.call(mapping, str)) {
        throw new DecoderError({
          tag: "unknown stringUnion variant",
          knownVariants: Object.keys(mapping),
          got: str
        });
      }
      return str;
    };
  }
  function unknownArray(value) {
    if (!Array.isArray(value)) {
      throw new DecoderError({ tag: "array", got: value });
    }
    return value;
  }
  function unknownRecord(value) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      throw new DecoderError({ tag: "object", got: value });
    }
    return value;
  }
  function array(decoder) {
    return function arrayDecoder(value) {
      const arr = unknownArray(value);
      const result = [];
      for (let index = 0; index < arr.length; index++) {
        try {
          result.push(decoder(arr[index]));
        } catch (error) {
          throw DecoderError.at(error, index);
        }
      }
      return result;
    };
  }
  function record(decoder) {
    return function recordDecoder(value) {
      const object = unknownRecord(value);
      const keys = Object.keys(object);
      const result = {};
      for (const key of keys) {
        if (key === "__proto__") {
          continue;
        }
        try {
          result[key] = decoder(object[key]);
        } catch (error) {
          throw DecoderError.at(error, key);
        }
      }
      return result;
    };
  }
  function fields(callback, { exact = "allow extra", allow = "object" } = {}) {
    return function fieldsDecoder(value) {
      const object = allow === "array" ? unknownArray(value) : unknownRecord(value);
      const knownFields = /* @__PURE__ */ Object.create(null);
      function field(key, decoder) {
        try {
          const result2 = decoder(object[key]);
          knownFields[key] = null;
          return result2;
        } catch (error) {
          throw DecoderError.at(error, key);
        }
      }
      const result = callback(field, object);
      if (exact !== "allow extra") {
        const unknownFields = Object.keys(object).filter((key) => !Object.prototype.hasOwnProperty.call(knownFields, key));
        if (unknownFields.length > 0) {
          throw new DecoderError({
            tag: "exact fields",
            knownFields: Object.keys(knownFields),
            got: unknownFields
          });
        }
      }
      return result;
    };
  }
  function fieldsAuto(mapping, { exact = "allow extra" } = {}) {
    return function fieldsAutoDecoder(value) {
      const object = unknownRecord(value);
      const keys = Object.keys(mapping);
      const result = {};
      for (const key of keys) {
        if (key === "__proto__") {
          continue;
        }
        const decoder = mapping[key];
        try {
          result[key] = decoder(object[key]);
        } catch (error) {
          throw DecoderError.at(error, key);
        }
      }
      if (exact !== "allow extra") {
        const unknownFields = Object.keys(object).filter((key) => !Object.prototype.hasOwnProperty.call(mapping, key));
        if (unknownFields.length > 0) {
          throw new DecoderError({
            tag: "exact fields",
            knownFields: keys,
            got: unknownFields
          });
        }
      }
      return result;
    };
  }
  function fieldsUnion(key, mapping) {
    return fields(function fieldsUnionFields(field, object) {
      const tag = field(key, string);
      if (Object.prototype.hasOwnProperty.call(mapping, tag)) {
        const decoder = mapping[tag];
        return decoder(object);
      }
      throw new DecoderError({
        tag: "unknown fieldsUnion tag",
        knownTags: Object.keys(mapping),
        got: tag,
        key
      });
    });
  }
  function multi(mapping) {
    return function multiDecoder(value) {
      if (value === void 0) {
        if (mapping.undefined !== void 0) {
          return mapping.undefined(value);
        }
      } else if (value === null) {
        if (mapping.null !== void 0) {
          return mapping.null(value);
        }
      } else if (typeof value === "boolean") {
        if (mapping.boolean !== void 0) {
          return mapping.boolean(value);
        }
      } else if (typeof value === "number") {
        if (mapping.number !== void 0) {
          return mapping.number(value);
        }
      } else if (typeof value === "string") {
        if (mapping.string !== void 0) {
          return mapping.string(value);
        }
      } else if (Array.isArray(value)) {
        if (mapping.array !== void 0) {
          return mapping.array(value);
        }
      } else {
        if (mapping.object !== void 0) {
          return mapping.object(value);
        }
      }
      throw new DecoderError({
        tag: "unknown multi type",
        knownTypes: Object.keys(mapping),
        got: value
      });
    };
  }
  function optional(decoder, defaultValue) {
    return function optionalDecoder(value) {
      if (value === void 0) {
        return defaultValue;
      }
      try {
        return decoder(value);
      } catch (error) {
        const newError = DecoderError.at(error);
        if (newError.path.length === 0) {
          newError.optional = true;
        }
        throw newError;
      }
    };
  }
  function chain(decoder, next) {
    return function chainDecoder(value) {
      return next(decoder(value));
    };
  }
  function formatDecoderErrorVariant(variant, options) {
    const formatGot = (value) => {
      const formatted = repr(value, options);
      return (options === null || options === void 0 ? void 0 : options.sensitive) === true ? `${formatted}
(Actual values are hidden in sensitive mode.)` : formatted;
    };
    const stringList = (strings) => strings.length === 0 ? "(none)" : strings.map((s) => JSON.stringify(s)).join(", ");
    const got = (message, value) => value === DecoderError.MISSING_VALUE ? message : `${message}
Got: ${formatGot(value)}`;
    switch (variant.tag) {
      case "boolean":
      case "number":
      case "string":
        return got(`Expected a ${variant.tag}`, variant.got);
      case "array":
      case "object":
        return got(`Expected an ${variant.tag}`, variant.got);
      case "unknown multi type":
        return `Expected one of these types: ${variant.knownTypes.length === 0 ? "never" : variant.knownTypes.join(", ")}
Got: ${formatGot(variant.got)}`;
      case "unknown fieldsUnion tag":
        return `Expected one of these tags: ${stringList(variant.knownTags)}
Got: ${formatGot(variant.got)}`;
      case "unknown stringUnion variant":
        return `Expected one of these variants: ${stringList(variant.knownVariants)}
Got: ${formatGot(variant.got)}`;
      case "exact fields":
        return `Expected only these fields: ${stringList(variant.knownFields)}
Found extra fields: ${formatGot(variant.got).replace(/^\[|\]$/g, "")}`;
      case "tuple size":
        return `Expected ${variant.expected} items
Got: ${variant.got}`;
      case "custom":
        return got(variant.message, variant.got);
    }
  }
  var DecoderError = class extends TypeError {
    constructor({ key, ...params }) {
      const variant = "tag" in params ? params : { tag: "custom", message: params.message, got: params.value };
      super(`${formatDecoderErrorVariant(
        variant,
        { sensitive: true }
      )}

For better error messages, see https://github.com/lydell/tiny-decoders#error-messages`);
      this.path = key === void 0 ? [] : [key];
      this.variant = variant;
      this.nullable = false;
      this.optional = false;
    }
    static at(error, key) {
      if (error instanceof DecoderError) {
        if (key !== void 0) {
          error.path.unshift(key);
        }
        return error;
      }
      return new DecoderError({
        tag: "custom",
        message: error instanceof Error ? error.message : String(error),
        got: DecoderError.MISSING_VALUE,
        key
      });
    }
    format(options) {
      const path = this.path.map((part) => `[${JSON.stringify(part)}]`).join("");
      const nullableString = this.nullable ? " (nullable)" : "";
      const optionalString = this.optional ? " (optional)" : "";
      const variant = formatDecoderErrorVariant(this.variant, options);
      return `At root${path}${nullableString}${optionalString}:
${variant}`;
    }
  };
  DecoderError.MISSING_VALUE = Symbol("DecoderError.MISSING_VALUE");
  function repr(value, { recurse = true, maxArrayChildren = 5, maxObjectChildren = 3, maxLength = 100, recurseMaxLength = 20, sensitive = false } = {}) {
    const type = typeof value;
    const toStringType = Object.prototype.toString.call(value).replace(/^\[object\s+(.+)\]$/, "$1");
    try {
      if (value == null || type === "number" || type === "boolean" || type === "symbol" || toStringType === "RegExp") {
        return sensitive ? toStringType.toLowerCase() : truncate(String(value), maxLength);
      }
      if (type === "string") {
        return sensitive ? type : truncate(JSON.stringify(value), maxLength);
      }
      if (typeof value === "function") {
        return `function ${truncate(JSON.stringify(value.name), maxLength)}`;
      }
      if (Array.isArray(value)) {
        const arr = value;
        if (!recurse && arr.length > 0) {
          return `${toStringType}(${arr.length})`;
        }
        const lastIndex = arr.length - 1;
        const items = [];
        const end = Math.min(maxArrayChildren - 1, lastIndex);
        for (let index = 0; index <= end; index++) {
          const item = index in arr ? repr(arr[index], {
            recurse: false,
            maxLength: recurseMaxLength,
            sensitive
          }) : "<empty>";
          items.push(item);
        }
        if (end < lastIndex) {
          items.push(`(${lastIndex - end} more)`);
        }
        return `[${items.join(", ")}]`;
      }
      if (toStringType === "Object") {
        const object = value;
        const keys = Object.keys(object);
        const { name } = object.constructor;
        if (!recurse && keys.length > 0) {
          return `${name}(${keys.length})`;
        }
        const numHidden = Math.max(0, keys.length - maxObjectChildren);
        const items = keys.slice(0, maxObjectChildren).map((key2) => `${truncate(JSON.stringify(key2), recurseMaxLength)}: ${repr(object[key2], {
          recurse: false,
          maxLength: recurseMaxLength,
          sensitive
        })}`).concat(numHidden > 0 ? `(${numHidden} more)` : []);
        const prefix = name === "Object" ? "" : `${name} `;
        return `${prefix}{${items.join(", ")}}`;
      }
      return toStringType;
    } catch (_error) {
      return toStringType;
    }
  }
  function truncate(str, maxLength) {
    const half = Math.floor(maxLength / 2);
    return str.length <= maxLength ? str : `${str.slice(0, half)}\u2026${str.slice(-half)}`;
  }

  // src/Helpers.ts
  function join(array2, separator) {
    return array2.join(separator);
  }
  function pad(number2) {
    return number2.toString().padStart(2, "0");
  }
  function formatDate(date) {
    return join(
      [pad(date.getFullYear()), pad(date.getMonth() + 1), pad(date.getDate())],
      "-"
    );
  }
  function formatTime(date) {
    return join(
      [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())],
      ":"
    );
  }

  // src/TeaProgram.ts
  async function runTeaProgram(options) {
    return new Promise((resolve, reject) => {
      const [initialModel, initialCmds] = options.init;
      let model = initialModel;
      const msgQueue = [];
      let killed = false;
      const dispatch = (dispatchedMsg) => {
        if (killed) {
          return;
        }
        const alreadyRunning = msgQueue.length > 0;
        msgQueue.push(dispatchedMsg);
        if (alreadyRunning) {
          return;
        }
        for (const msg of msgQueue) {
          const [newModel, cmds] = options.update(msg, model);
          model = newModel;
          runCmds(cmds);
        }
        msgQueue.length = 0;
      };
      const runCmds = (cmds) => {
        for (const cmd of cmds) {
          options.runCmd(
            cmd,
            mutable,
            dispatch,
            (result) => {
              cmds.length = 0;
              killed = true;
              resolve(result);
            },
            (error) => {
              cmds.length = 0;
              killed = true;
              reject(error);
            }
          );
          if (killed) {
            break;
          }
        }
      };
      const mutable = options.initMutable(
        dispatch,
        (result) => {
          killed = true;
          resolve(result);
        },
        (error) => {
          killed = true;
          reject(error);
        }
      );
      runCmds(initialCmds);
    });
  }

  // src/Types.ts
  var AbsolutePath = fieldsAuto({
    tag: () => "AbsolutePath",
    absolutePath: string
  });
  var CompilationMode = stringUnion({
    debug: null,
    standard: null,
    optimize: null
  });
  var BrowserUiPosition = stringUnion({
    TopLeft: null,
    TopRight: null,
    BottomLeft: null,
    BottomRight: null
  });

  // client/WebSocketMessages.ts
  var FocusedTabAcknowledged = fieldsAuto({
    tag: () => "FocusedTabAcknowledged"
  });
  var OpenEditorError = fieldsUnion("tag", {
    EnvNotSet: fieldsAuto({
      tag: () => "EnvNotSet"
    }),
    CommandFailed: fieldsAuto({
      tag: () => "CommandFailed",
      message: string
    })
  });
  var OpenEditorFailed = fieldsAuto({
    tag: () => "OpenEditorFailed",
    error: OpenEditorError
  });
  var ErrorLocation = fieldsUnion("tag", {
    FileOnly: fieldsAuto({
      tag: () => "FileOnly",
      file: AbsolutePath
    }),
    FileWithLineAndColumn: fieldsAuto({
      tag: () => "FileWithLineAndColumn",
      file: AbsolutePath,
      line: number,
      column: number
    }),
    Target: fieldsAuto({
      tag: () => "Target",
      targetName: string
    })
  });
  var CompileError = fieldsAuto({
    title: string,
    location: optional(ErrorLocation),
    htmlContent: string
  });
  var StatusChanged = fieldsAuto({
    tag: () => "StatusChanged",
    status: fieldsUnion("tag", {
      AlreadyUpToDate: fieldsAuto({
        tag: () => "AlreadyUpToDate",
        compilationMode: CompilationMode,
        browserUiPosition: BrowserUiPosition
      }),
      Busy: fieldsAuto({
        tag: () => "Busy",
        compilationMode: CompilationMode,
        browserUiPosition: BrowserUiPosition
      }),
      CompileError: fieldsAuto({
        tag: () => "CompileError",
        compilationMode: CompilationMode,
        browserUiPosition: BrowserUiPosition,
        openErrorOverlay: boolean,
        errors: array(CompileError),
        foregroundColor: string,
        backgroundColor: string
      }),
      ElmJsonError: fieldsAuto({
        tag: () => "ElmJsonError",
        error: string
      }),
      ClientError: fieldsAuto({
        tag: () => "ClientError",
        message: string
      })
    })
  });
  var SuccessfullyCompiled = fieldsAuto({
    tag: () => "SuccessfullyCompiled",
    code: string,
    elmCompiledTimestamp: number,
    compilationMode: CompilationMode,
    browserUiPosition: BrowserUiPosition
  });
  var SuccessfullyCompiledButRecordFieldsChanged = fieldsAuto({
    tag: () => "SuccessfullyCompiledButRecordFieldsChanged"
  });
  var WebSocketToClientMessage = fieldsUnion("tag", {
    FocusedTabAcknowledged,
    OpenEditorFailed,
    StatusChanged,
    SuccessfullyCompiled,
    SuccessfullyCompiledButRecordFieldsChanged
  });
  var WebSocketToServerMessage = fieldsUnion("tag", {
    ChangedCompilationMode: fieldsAuto({
      tag: () => "ChangedCompilationMode",
      compilationMode: CompilationMode
    }),
    ChangedBrowserUiPosition: fieldsAuto({
      tag: () => "ChangedBrowserUiPosition",
      browserUiPosition: BrowserUiPosition
    }),
    ChangedOpenErrorOverlay: fieldsAuto({
      tag: () => "ChangedOpenErrorOverlay",
      openErrorOverlay: boolean
    }),
    FocusedTab: fieldsAuto({
      tag: () => "FocusedTab"
    }),
    PressedOpenEditor: fieldsAuto({
      tag: () => "PressedOpenEditor",
      file: AbsolutePath,
      line: number,
      column: number
    })
  });
  function decodeWebSocketToClientMessage(message) {
    if (message.startsWith("//")) {
      const newlineIndexRaw = message.indexOf("\n");
      const newlineIndex = newlineIndexRaw === -1 ? message.length : newlineIndexRaw;
      const jsonString = message.slice(2, newlineIndex);
      const parsed = SuccessfullyCompiled(JSON.parse(jsonString));
      return { ...parsed, code: message };
    } else {
      return WebSocketToClientMessage(JSON.parse(message));
    }
  }

  // client/client.ts
  var window = globalThis;
  var IS_WEB_WORKER = window.window === void 0;
  var { __ELM_WATCH } = window;
  if (typeof __ELM_WATCH !== "object" || __ELM_WATCH === null) {
    __ELM_WATCH = {};
    Object.defineProperty(window, "__ELM_WATCH", { value: __ELM_WATCH });
  }
  __ELM_WATCH.MOCKED_TIMINGS ?? (__ELM_WATCH.MOCKED_TIMINGS = false);
  __ELM_WATCH.WEBSOCKET_TIMEOUT ?? (__ELM_WATCH.WEBSOCKET_TIMEOUT = 1e3);
  __ELM_WATCH.ON_INIT ?? (__ELM_WATCH.ON_INIT = () => {
  });
  __ELM_WATCH.ON_RENDER ?? (__ELM_WATCH.ON_RENDER = () => {
  });
  __ELM_WATCH.ON_REACHED_IDLE_STATE ?? (__ELM_WATCH.ON_REACHED_IDLE_STATE = () => {
  });
  __ELM_WATCH.RELOAD_STATUSES ?? (__ELM_WATCH.RELOAD_STATUSES = {});
  var RELOAD_MESSAGE_KEY = "__elmWatchReloadMessage";
  var RELOAD_TARGET_NAME_KEY_PREFIX = "__elmWatchReloadTarget__";
  __ELM_WATCH.RELOAD_PAGE ?? (__ELM_WATCH.RELOAD_PAGE = (message) => {
    if (message !== void 0) {
      try {
        window.sessionStorage.setItem(RELOAD_MESSAGE_KEY, message);
      } catch {
      }
    }
    if (IS_WEB_WORKER) {
      if (message !== void 0) {
        console.info(message);
      }
      console.error(
        message === void 0 ? "elm-watch: You need to reload the page! I seem to be running in a Web Worker, so I can\u2019t do it for you." : `elm-watch: You need to reload the page! I seem to be running in a Web Worker, so I couldn\u2019t actually reload the page (see above).`
      );
    } else {
      window.location.reload();
    }
  });
  __ELM_WATCH.KILL_MATCHING ?? (__ELM_WATCH.KILL_MATCHING = () => Promise.resolve());
  __ELM_WATCH.DISCONNECT ?? (__ELM_WATCH.DISCONNECT = () => {
  });
  __ELM_WATCH.LOG_DEBUG ?? (__ELM_WATCH.LOG_DEBUG = console.debug);
  var VERSION = "1.1.1";
  var TARGET_NAME = "Day17";
  var INITIAL_ELM_COMPILED_TIMESTAMP = Number(
    "1671311965643"
  );
  var ORIGINAL_COMPILATION_MODE = "standard";
  var ORIGINAL_BROWSER_UI_POSITION = "BottomLeft";
  var WEBSOCKET_PORT = "53141";
  var CONTAINER_ID = "elm-watch";
  var DEBUG = String("false") === "true";
  var BROWSER_UI_MOVED_EVENT = "BROWSER_UI_MOVED_EVENT";
  var CLOSE_ALL_ERROR_OVERLAYS_EVENT = "CLOSE_ALL_ERROR_OVERLAYS_EVENT";
  var JUST_CHANGED_BROWSER_UI_POSITION_TIMEOUT = 2e3;
  var SEND_KEY_DO_NOT_USE_ALL_THE_TIME = Symbol(
    "This value is supposed to only be obtained via `Status`."
  );
  function logDebug(...args) {
    if (DEBUG) {
      __ELM_WATCH.LOG_DEBUG(...args);
    }
  }
  function parseBrowseUiPositionWithFallback(value) {
    try {
      return BrowserUiPosition(value);
    } catch {
      return ORIGINAL_BROWSER_UI_POSITION;
    }
  }
  function run() {
    let elmCompiledTimestampBeforeReload = void 0;
    try {
      const message = window.sessionStorage.getItem(RELOAD_MESSAGE_KEY);
      if (message !== null) {
        console.info(message);
        window.sessionStorage.removeItem(RELOAD_MESSAGE_KEY);
      }
      const key = RELOAD_TARGET_NAME_KEY_PREFIX + TARGET_NAME;
      const previous = window.sessionStorage.getItem(key);
      if (previous !== null) {
        const number2 = Number(previous);
        if (Number.isFinite(number2)) {
          elmCompiledTimestampBeforeReload = number2;
        }
        window.sessionStorage.removeItem(key);
      }
    } catch {
    }
    const elements = IS_WEB_WORKER ? void 0 : getOrCreateTargetRoot();
    const browserUiPosition = elements === void 0 ? ORIGINAL_BROWSER_UI_POSITION : parseBrowseUiPositionWithFallback(elements.container.dataset.position);
    const getNow = () => new Date();
    runTeaProgram({
      initMutable: initMutable(getNow, elements),
      init: init(getNow(), browserUiPosition, elmCompiledTimestampBeforeReload),
      update: (msg, model) => {
        const [updatedModel, cmds] = update(msg, model);
        const modelChanged = updatedModel !== model;
        const reloadTrouble = model.status.tag !== updatedModel.status.tag && updatedModel.status.tag === "WaitingForReload" && updatedModel.elmCompiledTimestamp === updatedModel.elmCompiledTimestampBeforeReload;
        const newModel = modelChanged ? {
          ...updatedModel,
          previousStatusTag: model.status.tag,
          uiExpanded: reloadTrouble ? true : updatedModel.uiExpanded
        } : model;
        const oldErrorOverlay = getErrorOverlay(model.status);
        const newErrorOverlay = getErrorOverlay(newModel.status);
        const allCmds = modelChanged ? [
          ...cmds,
          {
            tag: "UpdateGlobalStatus",
            reloadStatus: statusToReloadStatus(newModel),
            elmCompiledTimestamp: newModel.elmCompiledTimestamp
          },
          newModel.status.tag === newModel.previousStatusTag && oldErrorOverlay?.openErrorOverlay === newErrorOverlay?.openErrorOverlay ? { tag: "NoCmd" } : {
            tag: "UpdateErrorOverlay",
            errors: newErrorOverlay === void 0 || !newErrorOverlay.openErrorOverlay ? /* @__PURE__ */ new Map() : newErrorOverlay.errors,
            sendKey: statusToSpecialCaseSendKey(newModel.status)
          },
          {
            tag: "Render",
            model: newModel,
            manageFocus: msg.tag === "UiMsg"
          },
          model.browserUiPosition === newModel.browserUiPosition ? { tag: "NoCmd" } : {
            tag: "SetBrowserUiPosition",
            browserUiPosition: newModel.browserUiPosition
          },
          reloadTrouble ? { tag: "TriggerReachedIdleState", reason: "ReloadTrouble" } : { tag: "NoCmd" }
        ] : cmds;
        logDebug(`${msg.tag} (${TARGET_NAME})`, msg, newModel, allCmds);
        return [newModel, allCmds];
      },
      runCmd: runCmd(getNow, elements)
    }).catch((error) => {
      console.error("elm-watch: Unexpectedly exited with error:", error);
    });
  }
  function getErrorOverlay(status) {
    return "errorOverlay" in status ? status.errorOverlay : void 0;
  }
  function statusToReloadStatus(model) {
    switch (model.status.tag) {
      case "Busy":
      case "Connecting":
        return { tag: "MightWantToReload" };
      case "CompileError":
      case "ElmJsonError":
      case "EvalError":
      case "Idle":
      case "SleepingBeforeReconnect":
      case "UnexpectedError":
        return { tag: "NoReloadWanted" };
      case "WaitingForReload":
        return model.elmCompiledTimestamp === model.elmCompiledTimestampBeforeReload ? { tag: "NoReloadWanted" } : { tag: "ReloadRequested", reasons: model.status.reasons };
    }
  }
  function statusToStatusType(statusTag) {
    switch (statusTag) {
      case "Idle":
        return "Success";
      case "Busy":
      case "Connecting":
      case "SleepingBeforeReconnect":
      case "WaitingForReload":
        return "Waiting";
      case "CompileError":
      case "ElmJsonError":
      case "EvalError":
      case "UnexpectedError":
        return "Error";
    }
  }
  function statusToSpecialCaseSendKey(status) {
    switch (status.tag) {
      case "CompileError":
      case "Idle":
        return status.sendKey;
      case "Busy":
        return SEND_KEY_DO_NOT_USE_ALL_THE_TIME;
      case "Connecting":
      case "SleepingBeforeReconnect":
      case "WaitingForReload":
      case "ElmJsonError":
      case "EvalError":
      case "UnexpectedError":
        return void 0;
    }
  }
  function getOrCreateContainer() {
    const existing = document.getElementById(CONTAINER_ID);
    if (existing !== null) {
      return existing;
    }
    const container = h(HTMLDivElement, { id: CONTAINER_ID });
    container.style.all = "unset";
    container.style.position = "fixed";
    container.style.zIndex = "2147483647";
    const shadowRoot = container.attachShadow({ mode: "open" });
    shadowRoot.append(h(HTMLStyleElement, {}, CSS));
    document.documentElement.append(container);
    return container;
  }
  function getOrCreateTargetRoot() {
    const container = getOrCreateContainer();
    const { shadowRoot } = container;
    if (shadowRoot === null) {
      throw new Error(
        `elm-watch: Cannot set up hot reload, because an element with ID ${CONTAINER_ID} exists, but \`.shadowRoot\` is null!`
      );
    }
    let overlay = shadowRoot.querySelector(`.${CLASS.overlay}`);
    if (overlay === null) {
      overlay = h(HTMLDivElement, {
        className: CLASS.overlay,
        attrs: { "data-test-id": "Overlay" }
      });
      shadowRoot.append(overlay);
    }
    let overlayCloseButton = shadowRoot.querySelector(
      `.${CLASS.overlayCloseButton}`
    );
    if (overlayCloseButton === null) {
      const closeAllErrorOverlays = () => {
        shadowRoot.dispatchEvent(new CustomEvent(CLOSE_ALL_ERROR_OVERLAYS_EVENT));
      };
      overlayCloseButton = h(HTMLButtonElement, {
        className: CLASS.overlayCloseButton,
        attrs: {
          "aria-label": "Close error overlay",
          "data-test-id": "OverlayCloseButton"
        },
        onclick: closeAllErrorOverlays
      });
      shadowRoot.append(overlayCloseButton);
      const overlayNonNull = overlay;
      window.addEventListener(
        "keydown",
        (event) => {
          if (overlayNonNull.hasChildNodes() && event.key === "Escape") {
            event.preventDefault();
            event.stopImmediatePropagation();
            closeAllErrorOverlays();
          }
        },
        true
      );
    }
    let root = shadowRoot.querySelector(`.${CLASS.root}`);
    if (root === null) {
      root = h(HTMLDivElement, { className: CLASS.root });
      shadowRoot.append(root);
    }
    const targetRoot = createTargetRoot(TARGET_NAME);
    root.append(targetRoot);
    const elements = {
      container,
      shadowRoot,
      overlay,
      overlayCloseButton,
      root,
      targetRoot
    };
    setBrowserUiPosition(ORIGINAL_BROWSER_UI_POSITION, elements);
    return elements;
  }
  function createTargetRoot(targetName) {
    return h(HTMLDivElement, {
      className: CLASS.targetRoot,
      attrs: { "data-target": targetName }
    });
  }
  function browserUiPositionToCss(browserUiPosition) {
    switch (browserUiPosition) {
      case "TopLeft":
        return { top: "-1px", bottom: "auto", left: "-1px", right: "auto" };
      case "TopRight":
        return { top: "-1px", bottom: "auto", left: "auto", right: "-1px" };
      case "BottomLeft":
        return { top: "auto", bottom: "-1px", left: "-1px", right: "auto" };
      case "BottomRight":
        return { top: "auto", bottom: "-1px", left: "auto", right: "-1px" };
    }
  }
  function browserUiPositionToCssForChooser(browserUiPosition) {
    switch (browserUiPosition) {
      case "TopLeft":
        return { top: "auto", bottom: "0", left: "auto", right: "0" };
      case "TopRight":
        return { top: "auto", bottom: "0", left: "0", right: "auto" };
      case "BottomLeft":
        return { top: "0", bottom: "auto", left: "auto", right: "0" };
      case "BottomRight":
        return { top: "0", bottom: "auto", left: "0", right: "auto" };
    }
  }
  function setBrowserUiPosition(browserUiPosition, elements) {
    const isFirstTargetRoot = elements.targetRoot.previousElementSibling === null;
    if (!isFirstTargetRoot) {
      return;
    }
    elements.container.dataset.position = browserUiPosition;
    for (const [key, value] of Object.entries(
      browserUiPositionToCss(browserUiPosition)
    )) {
      elements.container.style.setProperty(key, value);
    }
    const isInBottomHalf = browserUiPosition === "BottomLeft" || browserUiPosition === "BottomRight";
    elements.root.classList.toggle(CLASS.rootBottomHalf, isInBottomHalf);
    elements.shadowRoot.dispatchEvent(
      new CustomEvent(BROWSER_UI_MOVED_EVENT, { detail: browserUiPosition })
    );
  }
  var initMutable = (getNow, elements) => (dispatch, resolvePromise) => {
    let removeListeners = [];
    const mutable = {
      removeListeners: () => {
        for (const removeListener of removeListeners) {
          removeListener();
        }
      },
      webSocket: initWebSocket(
        getNow,
        INITIAL_ELM_COMPILED_TIMESTAMP,
        dispatch
      ),
      webSocketTimeoutId: void 0
    };
    mutable.webSocket.addEventListener(
      "open",
      () => {
        removeListeners = [
          addEventListener(window, "focus", (event) => {
            if (event instanceof CustomEvent && event.detail !== TARGET_NAME) {
              return;
            }
            dispatch({ tag: "FocusedTab" });
          }),
          addEventListener(window, "visibilitychange", () => {
            if (document.visibilityState === "visible") {
              dispatch({
                tag: "PageVisibilityChangedToVisible",
                date: getNow()
              });
            }
          }),
          ...elements === void 0 ? [] : [
            addEventListener(
              elements.shadowRoot,
              BROWSER_UI_MOVED_EVENT,
              (event) => {
                dispatch({
                  tag: "BrowserUiMoved",
                  browserUiPosition: fields(
                    (field) => field("detail", parseBrowseUiPositionWithFallback)
                  )(event)
                });
              }
            ),
            addEventListener(
              elements.shadowRoot,
              CLOSE_ALL_ERROR_OVERLAYS_EVENT,
              () => {
                dispatch({
                  tag: "UiMsg",
                  date: getNow(),
                  msg: {
                    tag: "ChangedOpenErrorOverlay",
                    openErrorOverlay: false
                  }
                });
              }
            )
          ]
        ];
      },
      { once: true }
    );
    __ELM_WATCH.RELOAD_STATUSES[TARGET_NAME] = {
      tag: "MightWantToReload"
    };
    const originalOnInit = __ELM_WATCH.ON_INIT;
    __ELM_WATCH.ON_INIT = () => {
      dispatch({ tag: "AppInit" });
      originalOnInit();
    };
    const originalKillMatching = __ELM_WATCH.KILL_MATCHING;
    __ELM_WATCH.KILL_MATCHING = (targetName) => new Promise((resolve, reject) => {
      if (targetName.test(TARGET_NAME) && mutable.webSocket.readyState !== WebSocket.CLOSED) {
        mutable.webSocket.addEventListener("close", () => {
          originalKillMatching(targetName).then(resolve).catch(reject);
        });
        mutable.removeListeners();
        mutable.webSocket.close();
        if (mutable.webSocketTimeoutId !== void 0) {
          clearTimeout(mutable.webSocketTimeoutId);
          mutable.webSocketTimeoutId = void 0;
        }
        elements?.targetRoot.remove();
        resolvePromise(void 0);
      } else {
        originalKillMatching(targetName).then(resolve).catch(reject);
      }
    });
    const originalDisconnect = __ELM_WATCH.DISCONNECT;
    __ELM_WATCH.DISCONNECT = (targetName) => {
      if (targetName.test(TARGET_NAME) && mutable.webSocket.readyState !== WebSocket.CLOSED) {
        mutable.webSocket.close();
      } else {
        originalDisconnect(targetName);
      }
    };
    return mutable;
  };
  function addEventListener(target, eventName, listener) {
    target.addEventListener(eventName, listener);
    return () => {
      target.removeEventListener(eventName, listener);
    };
  }
  function initWebSocket(getNow, elmCompiledTimestamp, dispatch) {
    const hostname = window.location.hostname === "" ? "localhost" : window.location.hostname;
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const url = new URL(`${protocol}://${hostname}:${WEBSOCKET_PORT}/elm-watch`);
    url.searchParams.set("elmWatchVersion", VERSION);
    url.searchParams.set("targetName", TARGET_NAME);
    url.searchParams.set("elmCompiledTimestamp", elmCompiledTimestamp.toString());
    const webSocket = new WebSocket(url);
    webSocket.addEventListener("open", () => {
      dispatch({ tag: "WebSocketConnected", date: getNow() });
    });
    webSocket.addEventListener("close", () => {
      dispatch({
        tag: "WebSocketClosed",
        date: getNow()
      });
    });
    webSocket.addEventListener("message", (event) => {
      dispatch({
        tag: "WebSocketMessageReceived",
        date: getNow(),
        data: event.data
      });
    });
    return webSocket;
  }
  var init = (date, browserUiPosition, elmCompiledTimestampBeforeReload) => {
    const model = {
      status: { tag: "Connecting", date, attemptNumber: 1 },
      previousStatusTag: "Idle",
      compilationMode: ORIGINAL_COMPILATION_MODE,
      browserUiPosition,
      lastBrowserUiPositionChangeDate: void 0,
      elmCompiledTimestamp: INITIAL_ELM_COMPILED_TIMESTAMP,
      elmCompiledTimestampBeforeReload,
      uiExpanded: false
    };
    return [model, [{ tag: "Render", model, manageFocus: false }]];
  };
  function update(msg, model) {
    switch (msg.tag) {
      case "AppInit":
        return [{ ...model }, []];
      case "BrowserUiMoved":
        return [{ ...model, browserUiPosition: msg.browserUiPosition }, []];
      case "EvalErrored":
        return [
          {
            ...model,
            status: { tag: "EvalError", date: msg.date },
            uiExpanded: true
          },
          [
            {
              tag: "TriggerReachedIdleState",
              reason: "EvalErrored"
            }
          ]
        ];
      case "EvalNeedsReload":
        return [
          {
            ...model,
            status: {
              tag: "WaitingForReload",
              date: msg.date,
              reasons: msg.reasons
            }
          },
          []
        ];
      case "EvalSucceeded":
        return [
          {
            ...model,
            status: {
              tag: "Idle",
              date: msg.date,
              sendKey: SEND_KEY_DO_NOT_USE_ALL_THE_TIME
            }
          },
          [
            {
              tag: "TriggerReachedIdleState",
              reason: "EvalSucceeded"
            }
          ]
        ];
      case "FocusedTab":
        return [
          statusToStatusType(model.status.tag) === "Error" ? { ...model } : model,
          [
            {
              tag: "SendMessage",
              message: { tag: "FocusedTab" },
              sendKey: SEND_KEY_DO_NOT_USE_ALL_THE_TIME
            },
            {
              tag: "WebSocketTimeoutBegin"
            }
          ]
        ];
      case "PageVisibilityChangedToVisible":
        return reconnect(model, msg.date, { force: true });
      case "SleepBeforeReconnectDone":
        return reconnect(model, msg.date, { force: false });
      case "UiMsg":
        return onUiMsg(msg.date, msg.msg, model);
      case "WebSocketClosed": {
        const attemptNumber = "attemptNumber" in model.status ? model.status.attemptNumber + 1 : 1;
        return [
          {
            ...model,
            status: {
              tag: "SleepingBeforeReconnect",
              date: msg.date,
              attemptNumber
            }
          },
          [{ tag: "SleepBeforeReconnect", attemptNumber }]
        ];
      }
      case "WebSocketConnected":
        return [
          {
            ...model,
            status: { tag: "Busy", date: msg.date, errorOverlay: void 0 }
          },
          []
        ];
      case "WebSocketMessageReceived": {
        const result = parseWebSocketMessageData(msg.data);
        switch (result.tag) {
          case "Success":
            return onWebSocketToClientMessage(msg.date, result.message, model);
          case "Error":
            return [
              {
                ...model,
                status: {
                  tag: "UnexpectedError",
                  date: msg.date,
                  message: result.message
                },
                uiExpanded: true
              },
              []
            ];
        }
      }
    }
  }
  function onUiMsg(date, msg, model) {
    switch (msg.tag) {
      case "ChangedBrowserUiPosition":
        return [
          {
            ...model,
            browserUiPosition: msg.browserUiPosition,
            lastBrowserUiPositionChangeDate: date
          },
          [
            {
              tag: "SendMessage",
              message: {
                tag: "ChangedBrowserUiPosition",
                browserUiPosition: msg.browserUiPosition
              },
              sendKey: msg.sendKey
            }
          ]
        ];
      case "ChangedCompilationMode":
        return [
          {
            ...model,
            status: {
              tag: "Busy",
              date,
              errorOverlay: getErrorOverlay(model.status)
            },
            compilationMode: msg.compilationMode
          },
          [
            {
              tag: "SendMessage",
              message: {
                tag: "ChangedCompilationMode",
                compilationMode: msg.compilationMode
              },
              sendKey: msg.sendKey
            }
          ]
        ];
      case "ChangedOpenErrorOverlay":
        return "errorOverlay" in model.status && model.status.errorOverlay !== void 0 ? [
          {
            ...model,
            status: {
              ...model.status,
              errorOverlay: {
                ...model.status.errorOverlay,
                openErrorOverlay: msg.openErrorOverlay
              }
            },
            uiExpanded: false
          },
          [
            {
              tag: "SendMessage",
              message: {
                tag: "ChangedOpenErrorOverlay",
                openErrorOverlay: msg.openErrorOverlay
              },
              sendKey: model.status.tag === "Busy" ? SEND_KEY_DO_NOT_USE_ALL_THE_TIME : model.status.sendKey
            }
          ]
        ] : [model, []];
      case "PressedChevron":
        return [{ ...model, uiExpanded: !model.uiExpanded }, []];
      case "PressedOpenEditor":
        return [
          model,
          [
            {
              tag: "SendMessage",
              message: {
                tag: "PressedOpenEditor",
                file: msg.file,
                line: msg.line,
                column: msg.column
              },
              sendKey: msg.sendKey
            }
          ]
        ];
      case "PressedReconnectNow":
        return reconnect(model, date, { force: true });
    }
  }
  function onWebSocketToClientMessage(date, msg, model) {
    switch (msg.tag) {
      case "FocusedTabAcknowledged":
        return [model, [{ tag: "WebSocketTimeoutClear" }]];
      case "OpenEditorFailed":
        return [
          model.status.tag === "CompileError" ? {
            ...model,
            status: { ...model.status, openEditorError: msg.error },
            uiExpanded: true
          } : model,
          [
            {
              tag: "TriggerReachedIdleState",
              reason: "OpenEditorFailed"
            }
          ]
        ];
      case "StatusChanged":
        return statusChanged(date, msg, model);
      case "SuccessfullyCompiled": {
        const justChangedBrowserUiPosition = model.lastBrowserUiPositionChangeDate !== void 0 && date.getTime() - model.lastBrowserUiPositionChangeDate.getTime() < JUST_CHANGED_BROWSER_UI_POSITION_TIMEOUT;
        return msg.compilationMode !== ORIGINAL_COMPILATION_MODE ? [
          {
            ...model,
            status: {
              tag: "WaitingForReload",
              date,
              reasons: ORIGINAL_COMPILATION_MODE === "proxy" ? [] : [
                `compilation mode changed from ${ORIGINAL_COMPILATION_MODE} to ${msg.compilationMode}.`
              ]
            },
            compilationMode: msg.compilationMode
          },
          []
        ] : [
          {
            ...model,
            compilationMode: msg.compilationMode,
            elmCompiledTimestamp: msg.elmCompiledTimestamp,
            browserUiPosition: msg.browserUiPosition,
            lastBrowserUiPositionChangeDate: void 0
          },
          [
            { tag: "Eval", code: msg.code },
            justChangedBrowserUiPosition ? {
              tag: "SetBrowserUiPosition",
              browserUiPosition: msg.browserUiPosition
            } : { tag: "NoCmd" }
          ]
        ];
      }
      case "SuccessfullyCompiledButRecordFieldsChanged":
        return [
          {
            ...model,
            status: {
              tag: "WaitingForReload",
              date,
              reasons: [
                `record field mangling in optimize mode was different than last time.`
              ]
            }
          },
          []
        ];
    }
  }
  function statusChanged(date, { status }, model) {
    switch (status.tag) {
      case "AlreadyUpToDate":
        return [
          {
            ...model,
            status: {
              tag: "Idle",
              date,
              sendKey: SEND_KEY_DO_NOT_USE_ALL_THE_TIME
            },
            compilationMode: status.compilationMode,
            browserUiPosition: status.browserUiPosition
          },
          [
            {
              tag: "TriggerReachedIdleState",
              reason: "AlreadyUpToDate"
            }
          ]
        ];
      case "Busy":
        return [
          {
            ...model,
            status: {
              tag: "Busy",
              date,
              errorOverlay: getErrorOverlay(model.status)
            },
            compilationMode: status.compilationMode,
            browserUiPosition: status.browserUiPosition
          },
          []
        ];
      case "ClientError":
        return [
          {
            ...model,
            status: { tag: "UnexpectedError", date, message: status.message },
            uiExpanded: true
          },
          [
            {
              tag: "TriggerReachedIdleState",
              reason: "ClientError"
            }
          ]
        ];
      case "CompileError":
        return [
          {
            ...model,
            status: {
              tag: "CompileError",
              date,
              sendKey: SEND_KEY_DO_NOT_USE_ALL_THE_TIME,
              errorOverlay: {
                errors: new Map(
                  status.errors.map((error) => {
                    const overlayError = {
                      title: error.title,
                      location: error.location,
                      htmlContent: error.htmlContent,
                      foregroundColor: status.foregroundColor,
                      backgroundColor: status.backgroundColor
                    };
                    const id = JSON.stringify(overlayError);
                    return [id, overlayError];
                  })
                ),
                openErrorOverlay: status.openErrorOverlay
              },
              openEditorError: void 0
            },
            compilationMode: status.compilationMode,
            browserUiPosition: status.browserUiPosition
          },
          [
            {
              tag: "TriggerReachedIdleState",
              reason: "CompileError"
            }
          ]
        ];
      case "ElmJsonError":
        return [
          {
            ...model,
            status: { tag: "ElmJsonError", date, error: status.error }
          },
          [
            {
              tag: "TriggerReachedIdleState",
              reason: "ElmJsonError"
            }
          ]
        ];
    }
  }
  function reconnect(model, date, { force }) {
    return model.status.tag === "SleepingBeforeReconnect" && (date.getTime() - model.status.date.getTime() >= retryWaitMs(model.status.attemptNumber) || force) ? [
      {
        ...model,
        status: {
          tag: "Connecting",
          date,
          attemptNumber: model.status.attemptNumber
        }
      },
      [
        {
          tag: "Reconnect",
          elmCompiledTimestamp: model.elmCompiledTimestamp
        }
      ]
    ] : [model, []];
  }
  function retryWaitMs(attemptNumber) {
    return Math.min(1e3 + 10 * attemptNumber ** 2, 1e3 * 60);
  }
  function printRetryWaitMs(attemptNumber) {
    return `${retryWaitMs(attemptNumber) / 1e3} seconds`;
  }
  var runCmd = (getNow, elements) => (cmd, mutable, dispatch, _resolvePromise, rejectPromise) => {
    switch (cmd.tag) {
      case "Eval": {
        try {
          const f = new Function(cmd.code);
          f();
          dispatch({ tag: "EvalSucceeded", date: getNow() });
        } catch (unknownError) {
          if (unknownError instanceof Error && unknownError.message.startsWith("ELM_WATCH_RELOAD_NEEDED")) {
            dispatch({
              tag: "EvalNeedsReload",
              date: getNow(),
              reasons: unknownError.message.split("\n\n---\n\n").slice(1)
            });
          } else {
            void Promise.reject(unknownError);
            dispatch({ tag: "EvalErrored", date: getNow() });
          }
        }
        return;
      }
      case "NoCmd":
        return;
      case "Reconnect":
        mutable.webSocket = initWebSocket(
          getNow,
          cmd.elmCompiledTimestamp,
          dispatch
        );
        return;
      case "Render": {
        const { model } = cmd;
        const info = {
          version: VERSION,
          webSocketUrl: new URL(mutable.webSocket.url),
          targetName: TARGET_NAME,
          originalCompilationMode: ORIGINAL_COMPILATION_MODE,
          initializedElmAppsStatus: checkInitializedElmAppsStatus(),
          errorOverlayVisible: elements !== void 0 && !elements.overlay.hidden
        };
        if (elements === void 0) {
          if (model.status.tag !== model.previousStatusTag) {
            const isError = statusToStatusType(model.status.tag) === "Error";
            const consoleMethod = isError ? console.error : console.info;
            consoleMethod(renderWebWorker(model, info));
          }
        } else {
          const { targetRoot } = elements;
          render(getNow, targetRoot, dispatch, model, info, cmd.manageFocus);
        }
        return;
      }
      case "SendMessage": {
        const json = JSON.stringify(cmd.message);
        try {
          mutable.webSocket.send(json);
        } catch (error) {
          console.error("elm-watch: Failed to send WebSocket message:", error);
        }
        return;
      }
      case "SetBrowserUiPosition":
        if (elements !== void 0) {
          setBrowserUiPosition(cmd.browserUiPosition, elements);
        }
        return;
      case "SleepBeforeReconnect":
        setTimeout(() => {
          if (typeof document === "undefined" || document.visibilityState === "visible") {
            dispatch({ tag: "SleepBeforeReconnectDone", date: getNow() });
          }
        }, retryWaitMs(cmd.attemptNumber));
        return;
      case "TriggerReachedIdleState":
        Promise.resolve().then(() => {
          __ELM_WATCH.ON_REACHED_IDLE_STATE(cmd.reason);
        }).catch(rejectPromise);
        return;
      case "UpdateErrorOverlay":
        if (elements !== void 0) {
          updateErrorOverlay(
            TARGET_NAME,
            (msg) => {
              dispatch({ tag: "UiMsg", date: getNow(), msg });
            },
            cmd.sendKey,
            cmd.errors,
            elements.overlay,
            elements.overlayCloseButton
          );
        }
        return;
      case "UpdateGlobalStatus":
        __ELM_WATCH.RELOAD_STATUSES[TARGET_NAME] = cmd.reloadStatus;
        switch (cmd.reloadStatus.tag) {
          case "NoReloadWanted":
          case "MightWantToReload":
            break;
          case "ReloadRequested":
            try {
              window.sessionStorage.setItem(
                RELOAD_TARGET_NAME_KEY_PREFIX + TARGET_NAME,
                cmd.elmCompiledTimestamp.toString()
              );
            } catch {
            }
        }
        reloadPageIfNeeded();
        return;
      case "WebSocketTimeoutBegin":
        if (mutable.webSocketTimeoutId === void 0) {
          mutable.webSocketTimeoutId = setTimeout(() => {
            mutable.webSocketTimeoutId = void 0;
            mutable.webSocket.close();
            dispatch({
              tag: "WebSocketClosed",
              date: getNow()
            });
          }, __ELM_WATCH.WEBSOCKET_TIMEOUT);
        }
        return;
      case "WebSocketTimeoutClear":
        if (mutable.webSocketTimeoutId !== void 0) {
          clearTimeout(mutable.webSocketTimeoutId);
          mutable.webSocketTimeoutId = void 0;
        }
        return;
    }
  };
  function parseWebSocketMessageData(data) {
    try {
      return {
        tag: "Success",
        message: decodeWebSocketToClientMessage(string(data))
      };
    } catch (unknownError) {
      return {
        tag: "Error",
        message: `Failed to decode web socket message sent from the server:
${possiblyDecodeErrorToString(
          unknownError
        )}`
      };
    }
  }
  function possiblyDecodeErrorToString(unknownError) {
    return unknownError instanceof DecoderError ? unknownError.format() : unknownError instanceof Error ? unknownError.message : repr(unknownError);
  }
  function functionToNull(value) {
    return typeof value === "function" ? null : value;
  }
  var ProgramType = stringUnion({
    "Platform.worker": null,
    "Browser.sandbox": null,
    "Browser.element": null,
    "Browser.document": null,
    "Browser.application": null,
    Html: null
  });
  var ElmModule = chain(
    record(
      chain(
        functionToNull,
        multi({
          null: () => [],
          array: array(
            fields((field) => field("__elmWatchProgramType", ProgramType))
          ),
          object: (value) => ElmModule(value)
        })
      )
    ),
    (record2) => Object.values(record2).flat()
  );
  var ProgramTypes = fields((field) => field("Elm", ElmModule));
  function checkInitializedElmAppsStatus() {
    if (window.Elm !== void 0 && "__elmWatchProxy" in window.Elm) {
      return {
        tag: "DebuggerModeStatus",
        status: {
          tag: "Disabled",
          reason: noDebuggerYetReason
        }
      };
    }
    if (window.Elm === void 0) {
      return { tag: "MissingWindowElm" };
    }
    let programTypes;
    try {
      programTypes = ProgramTypes(window);
    } catch (unknownError) {
      return {
        tag: "DecodeError",
        message: possiblyDecodeErrorToString(unknownError)
      };
    }
    if (programTypes.length === 0) {
      return { tag: "NoProgramsAtAll" };
    }
    const noDebugger = programTypes.filter((programType) => {
      switch (programType) {
        case "Platform.worker":
        case "Html":
          return true;
        case "Browser.sandbox":
        case "Browser.element":
        case "Browser.document":
        case "Browser.application":
          return false;
      }
    });
    return {
      tag: "DebuggerModeStatus",
      status: noDebugger.length === programTypes.length ? {
        tag: "Disabled",
        reason: noDebuggerReason(new Set(noDebugger))
      } : { tag: "Enabled" }
    };
  }
  function reloadPageIfNeeded() {
    let shouldReload = false;
    const reasons = [];
    for (const [targetName, reloadStatus] of Object.entries(
      __ELM_WATCH.RELOAD_STATUSES
    )) {
      switch (reloadStatus.tag) {
        case "MightWantToReload":
          return;
        case "NoReloadWanted":
          break;
        case "ReloadRequested":
          shouldReload = true;
          if (reloadStatus.reasons.length > 0) {
            reasons.push([targetName, reloadStatus.reasons]);
          }
          break;
      }
    }
    if (!shouldReload) {
      return;
    }
    const first = reasons[0];
    const [separator, reasonString] = reasons.length === 1 && first !== void 0 && first[1].length === 1 ? [" ", `${first[1].join("")}
(target: ${first[0]})`] : [
      ":\n\n",
      reasons.map(
        ([targetName, subReasons]) => [
          targetName,
          ...subReasons.map((subReason) => `- ${subReason}`)
        ].join("\n")
      ).join("\n\n")
    ];
    const message = reasons.length === 0 ? void 0 : `elm-watch: I did a full page reload because${separator}${reasonString}`;
    __ELM_WATCH.RELOAD_STATUSES = {};
    __ELM_WATCH.RELOAD_PAGE(message);
  }
  function h(t, {
    attrs,
    style,
    localName,
    ...props
  }, ...children) {
    const element = document.createElement(
      localName ?? t.name.replace(/^HTML(\w+)Element$/, "$1").replace("Anchor", "a").replace("Paragraph", "p").replace(/^([DOU])List$/, "$1l").toLowerCase()
    );
    Object.assign(element, props);
    if (attrs !== void 0) {
      for (const [key, value] of Object.entries(attrs)) {
        element.setAttribute(key, value);
      }
    }
    if (style !== void 0) {
      for (const [key, value] of Object.entries(style)) {
        element.style[key] = value;
      }
    }
    for (const child of children) {
      if (child !== void 0) {
        element.append(
          typeof child === "string" ? document.createTextNode(child) : child
        );
      }
    }
    return element;
  }
  function renderWebWorker(model, info) {
    const statusData = statusIconAndText(model, info);
    return `${statusData.icon} elm-watch: ${statusData.status} ${formatTime(
      model.status.date
    )} (${info.targetName})`;
  }
  function render(getNow, targetRoot, dispatch, model, info, manageFocus) {
    targetRoot.replaceChildren(
      view(
        (msg) => {
          dispatch({ tag: "UiMsg", date: getNow(), msg });
        },
        model,
        info,
        manageFocus
      )
    );
    const firstFocusableElement = targetRoot.querySelector(`button, [tabindex]`);
    if (manageFocus && firstFocusableElement instanceof HTMLElement) {
      firstFocusableElement.focus();
    }
    __ELM_WATCH.ON_RENDER(TARGET_NAME);
  }
  var CLASS = {
    browserUiPositionButton: "browserUiPositionButton",
    browserUiPositionChooser: "browserUiPositionChooser",
    chevronButton: "chevronButton",
    compilationModeWithIcon: "compilationModeWithIcon",
    container: "container",
    debugModeIcon: "debugModeIcon",
    envNotSet: "envNotSet",
    errorLocationButton: "errorLocationButton",
    errorTitle: "errorTitle",
    expandedUiContainer: "expandedUiContainer",
    flashError: "flashError",
    flashSuccess: "flashSuccess",
    overlay: "overlay",
    overlayCloseButton: "overlayCloseButton",
    root: "root",
    rootBottomHalf: "rootBottomHalf",
    shortStatusContainer: "shortStatusContainer",
    targetName: "targetName",
    targetRoot: "targetRoot"
  };
  function getStatusClass({
    statusType,
    statusTypeChanged,
    hasReceivedHotReload,
    uiRelatedUpdate,
    errorOverlayVisible
  }) {
    switch (statusType) {
      case "Success":
        return statusTypeChanged && hasReceivedHotReload ? CLASS.flashSuccess : void 0;
      case "Error":
        return errorOverlayVisible ? statusTypeChanged && hasReceivedHotReload ? CLASS.flashError : void 0 : uiRelatedUpdate ? void 0 : CLASS.flashError;
      case "Waiting":
        return void 0;
    }
  }
  var CHEVRON_UP = "\u25B2";
  var CHEVRON_DOWN = "\u25BC";
  var CSS = `
input,
button,
select,
textarea {
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  color: inherit;
  margin: 0;
}

fieldset {
  display: grid;
  gap: 0.25em;
  margin: 0;
  border: 1px solid var(--grey);
  padding: 0.25em 0.75em 0.5em;
}

fieldset:disabled {
  color: var(--grey);
}

p,
dd {
  margin: 0;
}

dl {
  display: grid;
  grid-template-columns: auto auto;
  gap: 0.25em 1em;
  margin: 0;
  white-space: nowrap;
}

dt {
  text-align: right;
  color: var(--grey);
}

time {
  display: inline-grid;
  overflow: hidden;
}

time::after {
  content: attr(data-format);
  visibility: hidden;
  height: 0;
}

.${CLASS.overlay} {
  position: fixed;
  z-index: -2;
  inset: 0;
  overflow-y: auto;
  padding: 2ch 0;
}

.${CLASS.overlayCloseButton} {
  position: fixed;
  z-index: -1;
  top: 0;
  right: 0;
  appearance: none;
  padding: 1em;
  border: none;
  border-radius: 0;
  background: none;
  cursor: pointer;
  font-size: 1.25em;
  filter: drop-shadow(0 0 0.125em var(--backgroundColor));
}

.${CLASS.overlayCloseButton}::before,
.${CLASS.overlayCloseButton}::after {
  content: "";
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.125em;
  height: 1em;
  background-color: var(--foregroundColor);
  transform: translate(-50%, -50%) rotate(45deg);
}

.${CLASS.overlayCloseButton}::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.${CLASS.overlay},
.${CLASS.overlay} pre {
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
}

.${CLASS.overlay} details {
  --border-thickness: 0.125em;
  border-top: var(--border-thickness) solid;
  margin: 2ch 0;
}

.${CLASS.overlay} summary {
  cursor: pointer;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 2ch;
  word-break: break-word;
}

.${CLASS.overlay} summary::-webkit-details-marker {
  display: none;
}

.${CLASS.overlay} summary::marker {
  content: none;
}

.${CLASS.overlay} summary > * {
  pointer-events: auto;
}

.${CLASS.errorTitle} {
  display: inline-block;
  font-weight: bold;
  --padding: 1ch;
  padding: 0 var(--padding);
  transform: translate(calc(var(--padding) * -1), calc(-50% - var(--border-thickness) / 2));
}

.${CLASS.errorTitle}::before {
  content: "${CHEVRON_DOWN}";
  display: inline-block;
  margin-right: 1ch;
  transform: translateY(-0.0625em);
}

details[open] > summary > .${CLASS.errorTitle}::before {
  content: "${CHEVRON_UP}";
}

.${CLASS.errorLocationButton} {
  appearance: none;
  padding: 0;
  border: none;
  border-radius: 0;
  background: none;
  text-align: left;
  text-decoration: underline;
  cursor: pointer;
}

.${CLASS.overlay} pre {
  margin: 0;
  padding: 2ch;
  overflow-x: auto;
}

.${CLASS.root} {
  --grey: #767676;
  display: flex;
  align-items: start;
  overflow: auto;
  max-height: 100vh;
  max-width: 100vw;
  color: black;
  font-family: system-ui;
}

.${CLASS.rootBottomHalf} {
  align-items: end;
}

.${CLASS.targetRoot} + .${CLASS.targetRoot} {
  margin-left: -1px;
}

.${CLASS.targetRoot}:only-of-type .${CLASS.debugModeIcon},
.${CLASS.targetRoot}:only-of-type .${CLASS.targetName} {
  display: none;
}

.${CLASS.container} {
  display: flex;
  flex-direction: column-reverse;
  background-color: white;
  border: 1px solid var(--grey);
}

.${CLASS.rootBottomHalf} .${CLASS.container} {
  flex-direction: column;
}

.${CLASS.envNotSet} {
  display: grid;
  gap: 0.75em;
  margin: 2em 0;
}

.${CLASS.envNotSet},
.${CLASS.root} pre {
  border-left: 0.25em solid var(--grey);
  padding-left: 0.5em;
}

.${CLASS.root} pre {
  margin: 0;
  white-space: pre-wrap;
}

.${CLASS.expandedUiContainer} {
  padding: 1em;
  padding-top: 0.75em;
  display: grid;
  gap: 0.75em;
  outline: none;
  contain: paint;
}

.${CLASS.rootBottomHalf} .${CLASS.expandedUiContainer} {
  padding-bottom: 0.75em;
}

.${CLASS.expandedUiContainer}:is(.length0, .length1) {
  grid-template-columns: min-content;
}

.${CLASS.expandedUiContainer} > dl {
  justify-self: start;
}

.${CLASS.expandedUiContainer} label {
  display: grid;
  grid-template-columns: min-content auto;
  align-items: center;
  gap: 0.25em;
}

.${CLASS.expandedUiContainer} label.Disabled {
  color: var(--grey);
}

.${CLASS.expandedUiContainer} label > small {
  grid-column: 2;
}

.${CLASS.compilationModeWithIcon} {
  display: flex;
  align-items: center;
  gap: 0.25em;
}

.${CLASS.browserUiPositionChooser} {
  position: absolute;
  display: grid;
  grid-template-columns: min-content min-content;
  pointer-events: none;
}

.${CLASS.browserUiPositionButton} {
  appearance: none;
  padding: 0;
  border: none;
  background: none;
  border-radius: none;
  pointer-events: auto;
  width: 1em;
  height: 1em;
  text-align: center;
  line-height: 1em;
}

.${CLASS.browserUiPositionButton}:hover {
  background-color: rgba(0, 0, 0, 0.25);
}

.${CLASS.targetRoot}:not(:first-child) .${CLASS.browserUiPositionChooser} {
  display: none;
}

.${CLASS.shortStatusContainer} {
  line-height: 1;
  padding: 0.25em;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 0.25em;
}

.${CLASS.flashError}::before,
.${CLASS.flashSuccess}::before {
  content: "";
  position: absolute;
  margin-top: 0.5em;
  margin-left: 0.5em;
  --size: min(500px, 100vmin);
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  animation: flash 0.7s 0.05s ease-out both;
  pointer-events: none;
}

.${CLASS.flashError}::before {
  background-color: #eb0000;
}

.${CLASS.flashSuccess}::before {
  background-color: #00b600;
}

@keyframes flash {
  from {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.9;
  }

  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

@keyframes nudge {
  from {
    opacity: 0;
  }

  to {
    opacity: 0.8;
  }
}

@media (prefers-reduced-motion: reduce) {
  .${CLASS.flashError}::before,
  .${CLASS.flashSuccess}::before {
    transform: translate(-50%, -50%);
    width: 2em;
    height: 2em;
    animation: nudge 0.25s ease-in-out 4 alternate forwards;
  }
}

.${CLASS.chevronButton} {
  appearance: none;
  border: none;
  border-radius: 0;
  background: none;
  padding: 0;
  cursor: pointer;
}
`;
  function view(dispatch, passedModel, info, manageFocus) {
    const model = __ELM_WATCH.MOCKED_TIMINGS ? {
      ...passedModel,
      status: {
        ...passedModel.status,
        date: new Date("2022-02-05T13:10:05Z")
      }
    } : passedModel;
    const statusData = {
      ...statusIconAndText(model, info),
      ...viewStatus(dispatch, model, info)
    };
    const statusType = statusToStatusType(model.status.tag);
    const statusTypeChanged = statusType !== statusToStatusType(model.previousStatusTag);
    const statusClass = getStatusClass({
      statusType,
      statusTypeChanged,
      hasReceivedHotReload: model.elmCompiledTimestamp !== INITIAL_ELM_COMPILED_TIMESTAMP,
      uiRelatedUpdate: manageFocus,
      errorOverlayVisible: info.errorOverlayVisible
    });
    return h(
      HTMLDivElement,
      { className: CLASS.container },
      model.uiExpanded ? viewExpandedUi(
        model.status,
        statusData,
        info,
        model.browserUiPosition,
        dispatch
      ) : void 0,
      h(
        HTMLDivElement,
        {
          className: CLASS.shortStatusContainer,
          onclick: () => {
            dispatch({ tag: "PressedChevron" });
          }
        },
        h(
          HTMLButtonElement,
          {
            className: CLASS.chevronButton,
            attrs: { "aria-expanded": model.uiExpanded.toString() }
          },
          icon(
            model.uiExpanded ? CHEVRON_UP : CHEVRON_DOWN,
            model.uiExpanded ? "Collapse elm-watch" : "Expand elm-watch"
          )
        ),
        compilationModeIcon(model.compilationMode),
        icon(
          statusData.icon,
          statusData.status,
          statusClass === void 0 ? {} : {
            className: statusClass,
            onanimationend: (event) => {
              if (event.currentTarget instanceof HTMLElement) {
                event.currentTarget.classList.remove(statusClass);
              }
            }
          }
        ),
        h(
          HTMLTimeElement,
          { dateTime: model.status.date.toISOString() },
          formatTime(model.status.date)
        ),
        h(HTMLSpanElement, { className: CLASS.targetName }, TARGET_NAME)
      )
    );
  }
  function icon(emoji, alt, props) {
    return h(
      HTMLSpanElement,
      { attrs: { "aria-label": alt }, ...props },
      h(HTMLSpanElement, { attrs: { "aria-hidden": "true" } }, emoji)
    );
  }
  function viewExpandedUi(status, statusData, info, browserUiPosition, dispatch) {
    const items = [
      ["target", info.targetName],
      ["elm-watch", info.version],
      ["web socket", printWebSocketUrl(info.webSocketUrl)],
      [
        "updated",
        h(
          HTMLTimeElement,
          {
            dateTime: status.date.toISOString(),
            attrs: { "data-format": "2044-04-30 04:44:44" }
          },
          `${formatDate(status.date)} ${formatTime(status.date)}`
        )
      ],
      ["status", statusData.status],
      ...statusData.dl
    ];
    const browserUiPositionSendKey = statusToSpecialCaseSendKey(status);
    return h(
      HTMLDivElement,
      {
        className: `${CLASS.expandedUiContainer} length${statusData.content.length}`,
        attrs: {
          tabindex: "-1"
        }
      },
      h(
        HTMLDListElement,
        {},
        ...items.flatMap(([key, value]) => [
          h(HTMLElement, { localName: "dt" }, key),
          h(HTMLElement, { localName: "dd" }, value)
        ])
      ),
      ...statusData.content,
      browserUiPositionSendKey === void 0 ? void 0 : viewBrowserUiPositionChooser(
        browserUiPosition,
        dispatch,
        browserUiPositionSendKey
      )
    );
  }
  var allBrowserUiPositionsInOrder = [
    "TopLeft",
    "TopRight",
    "BottomLeft",
    "BottomRight"
  ];
  function viewBrowserUiPositionChooser(currentPosition, dispatch, sendKey) {
    const arrows = getBrowserUiPositionArrows(currentPosition);
    return h(
      HTMLDivElement,
      {
        className: CLASS.browserUiPositionChooser,
        style: browserUiPositionToCssForChooser(currentPosition)
      },
      ...allBrowserUiPositionsInOrder.map((position) => {
        const arrow = arrows[position];
        return arrow === void 0 ? h(HTMLDivElement, { style: { visibility: "hidden" } }, "\xB7") : h(
          HTMLButtonElement,
          {
            className: CLASS.browserUiPositionButton,
            attrs: { "data-position": position },
            onclick: () => {
              dispatch({
                tag: "ChangedBrowserUiPosition",
                browserUiPosition: position,
                sendKey
              });
            }
          },
          arrow
        );
      })
    );
  }
  var ARROW_UP = "\u2191";
  var ARROW_DOWN = "\u2193";
  var ARROW_LEFT = "\u2190";
  var ARROW_RIGHT = "\u2192";
  var ARROW_UP_LEFT = "\u2196";
  var ARROW_UP_RIGHT = "\u2197";
  var ARROW_DOWN_LEFT = "\u2199";
  var ARROW_DOWN_RIGHT = "\u2198";
  function getBrowserUiPositionArrows(browserUiPosition) {
    switch (browserUiPosition) {
      case "TopLeft":
        return {
          TopLeft: void 0,
          TopRight: ARROW_RIGHT,
          BottomLeft: ARROW_DOWN,
          BottomRight: ARROW_DOWN_RIGHT
        };
      case "TopRight":
        return {
          TopLeft: ARROW_LEFT,
          TopRight: void 0,
          BottomLeft: ARROW_DOWN_LEFT,
          BottomRight: ARROW_DOWN
        };
      case "BottomLeft":
        return {
          TopLeft: ARROW_UP,
          TopRight: ARROW_UP_RIGHT,
          BottomLeft: void 0,
          BottomRight: ARROW_RIGHT
        };
      case "BottomRight":
        return {
          TopLeft: ARROW_UP_LEFT,
          TopRight: ARROW_UP,
          BottomLeft: ARROW_LEFT,
          BottomRight: void 0
        };
    }
  }
  function statusIconAndText(model, info) {
    switch (model.status.tag) {
      case "Busy":
        return {
          icon: "\u23F3",
          status: "Waiting for compilation"
        };
      case "CompileError":
        return {
          icon: "\u{1F6A8}",
          status: "Compilation error"
        };
      case "Connecting":
        return {
          icon: "\u{1F50C}",
          status: "Connecting"
        };
      case "ElmJsonError":
        return {
          icon: "\u{1F6A8}",
          status: "elm.json or inputs error"
        };
      case "EvalError":
        return {
          icon: "\u26D4\uFE0F",
          status: "Eval error"
        };
      case "Idle":
        return {
          icon: idleIcon(info.initializedElmAppsStatus),
          status: "Successfully compiled"
        };
      case "SleepingBeforeReconnect":
        return {
          icon: "\u{1F50C}",
          status: "Sleeping"
        };
      case "UnexpectedError":
        return {
          icon: "\u274C",
          status: "Unexpected error"
        };
      case "WaitingForReload":
        return model.elmCompiledTimestamp === model.elmCompiledTimestampBeforeReload ? {
          icon: "\u274C",
          status: "Reload trouble"
        } : {
          icon: "\u23F3",
          status: "Waiting for reload"
        };
    }
  }
  function viewStatus(dispatch, model, info) {
    const { status, compilationMode } = model;
    switch (status.tag) {
      case "Busy":
        return {
          dl: [],
          content: [
            ...viewCompilationModeChooser({
              dispatch,
              sendKey: void 0,
              compilationMode,
              warnAboutCompilationModeMismatch: false,
              info
            }),
            ...status.errorOverlay === void 0 ? [] : [viewErrorOverlayToggleButton(dispatch, status.errorOverlay)]
          ]
        };
      case "CompileError":
        return {
          dl: [],
          content: [
            ...viewCompilationModeChooser({
              dispatch,
              sendKey: status.sendKey,
              compilationMode,
              warnAboutCompilationModeMismatch: true,
              info
            }),
            viewErrorOverlayToggleButton(dispatch, status.errorOverlay),
            ...status.openEditorError === void 0 ? [] : viewOpenEditorError(status.openEditorError)
          ]
        };
      case "Connecting":
        return {
          dl: [
            ["attempt", status.attemptNumber.toString()],
            ["sleep", printRetryWaitMs(status.attemptNumber)]
          ],
          content: [
            ...viewHttpsInfo(info.webSocketUrl),
            h(HTMLButtonElement, { disabled: true }, "Connecting web socket\u2026")
          ]
        };
      case "ElmJsonError":
        return {
          dl: [],
          content: [
            h(HTMLPreElement, { style: { minWidth: "80ch" } }, status.error)
          ]
        };
      case "EvalError":
        return {
          dl: [],
          content: [
            h(
              HTMLParagraphElement,
              {},
              "Check the console in the browser developer tools to see errors!"
            )
          ]
        };
      case "Idle":
        return {
          dl: [],
          content: viewCompilationModeChooser({
            dispatch,
            sendKey: status.sendKey,
            compilationMode,
            warnAboutCompilationModeMismatch: true,
            info
          })
        };
      case "SleepingBeforeReconnect":
        return {
          dl: [
            ["attempt", status.attemptNumber.toString()],
            ["sleep", printRetryWaitMs(status.attemptNumber)]
          ],
          content: [
            ...viewHttpsInfo(info.webSocketUrl),
            h(
              HTMLButtonElement,
              {
                onclick: () => {
                  dispatch({ tag: "PressedReconnectNow" });
                }
              },
              "Reconnect web socket now"
            )
          ]
        };
      case "UnexpectedError":
        return {
          dl: [],
          content: [
            h(
              HTMLParagraphElement,
              {},
              "I ran into an unexpected error! This is the error message:"
            ),
            h(HTMLPreElement, {}, status.message)
          ]
        };
      case "WaitingForReload":
        return {
          dl: [],
          content: model.elmCompiledTimestamp === model.elmCompiledTimestampBeforeReload ? [
            "A while ago I reloaded the page to get new compiled JavaScript.",
            "But it looks like after the last page reload I got the same JavaScript as before, instead of new stuff!",
            `The old JavaScript was compiled ${new Date(
              model.elmCompiledTimestamp
            ).toLocaleString()}, and so was the JavaScript currently running.`,
            "I currently need to reload the page again, but fear a reload loop if I try.",
            "Do you have accidental HTTP caching enabled maybe?",
            "Try hard refreshing the page and see if that helps, and consider disabling HTTP caching during development."
          ].map((text) => h(HTMLParagraphElement, {}, text)) : [h(HTMLParagraphElement, {}, "Waiting for other targets\u2026")]
        };
    }
  }
  function viewErrorOverlayToggleButton(dispatch, errorOverlay) {
    return h(
      HTMLButtonElement,
      {
        attrs: {
          "data-test-id": errorOverlay.openErrorOverlay ? "HideErrorOverlayButton" : "ShowErrorOverlayButton"
        },
        onclick: () => {
          dispatch({
            tag: "ChangedOpenErrorOverlay",
            openErrorOverlay: !errorOverlay.openErrorOverlay
          });
        }
      },
      errorOverlay.openErrorOverlay ? "Hide errors" : "Show errors"
    );
  }
  function viewOpenEditorError(error) {
    switch (error.tag) {
      case "EnvNotSet":
        return [
          h(
            HTMLDivElement,
            { className: CLASS.envNotSet },
            h(
              HTMLParagraphElement,
              {},
              "\u2139\uFE0F Clicking error locations only works if you set it up."
            ),
            h(
              HTMLParagraphElement,
              {},
              "Check this out: ",
              h(
                HTMLAnchorElement,
                {
                  href: "https://lydell.github.io/elm-watch/browser-ui/#clickable-error-locations",
                  target: "_blank",
                  rel: "noreferrer"
                },
                h(
                  HTMLElement,
                  { localName: "strong" },
                  "Clickable error locations"
                )
              )
            )
          )
        ];
      case "CommandFailed":
        return [
          h(
            HTMLParagraphElement,
            {},
            h(
              HTMLElement,
              { localName: "strong" },
              "Opening the location in your editor failed!"
            )
          ),
          h(HTMLPreElement, {}, error.message)
        ];
    }
  }
  function idleIcon(status) {
    switch (status.tag) {
      case "DecodeError":
      case "MissingWindowElm":
        return "\u274C";
      case "NoProgramsAtAll":
        return "\u2753";
      case "DebuggerModeStatus":
        return "\u2705";
    }
  }
  function compilationModeIcon(compilationMode) {
    switch (compilationMode) {
      case "proxy":
        return void 0;
      case "debug":
        return icon("\u{1F41B}", "Debug mode", { className: CLASS.debugModeIcon });
      case "standard":
        return void 0;
      case "optimize":
        return icon("\u{1F680}", "Optimize mode");
    }
  }
  function printWebSocketUrl(url) {
    const hostname = url.hostname.endsWith(".localhost") ? "localhost" : url.hostname;
    return `${url.protocol}//${hostname}:${url.port}`;
  }
  function viewHttpsInfo(webSocketUrl) {
    return webSocketUrl.protocol === "wss:" ? [
      h(
        HTMLParagraphElement,
        {},
        h(HTMLElement, { localName: "strong" }, "Having trouble connecting?")
      ),
      h(
        HTMLParagraphElement,
        {},
        " You might need to ",
        h(
          HTMLAnchorElement,
          { href: new URL(`https://${webSocketUrl.host}/accept`).href },
          "accept elm-watch\u2019s self-signed certificate"
        ),
        ". "
      ),
      h(
        HTMLParagraphElement,
        {},
        h(
          HTMLAnchorElement,
          {
            href: "https://lydell.github.io/elm-watch/https/",
            target: "_blank",
            rel: "noreferrer"
          },
          "More information"
        ),
        "."
      )
    ] : [];
  }
  var noDebuggerYetReason = "The Elm debugger isn't available at this point.";
  function noDebuggerReason(noDebuggerProgramTypes) {
    return `The Elm debugger isn't supported by ${humanList(
      Array.from(noDebuggerProgramTypes, (programType) => `\`${programType}\``),
      "and"
    )} programs.`;
  }
  function humanList(list, joinWord) {
    const { length } = list;
    return length <= 1 ? list.join("") : length === 2 ? list.join(` ${joinWord} `) : `${list.slice(0, length - 2).join(", ")}, ${list.slice(-2).join(` ${joinWord} `)}`;
  }
  function viewCompilationModeChooser({
    dispatch,
    sendKey,
    compilationMode: selectedMode,
    warnAboutCompilationModeMismatch,
    info
  }) {
    switch (info.initializedElmAppsStatus.tag) {
      case "DecodeError":
        return [
          h(
            HTMLParagraphElement,
            {},
            "window.Elm does not look like expected! This is the error message:"
          ),
          h(HTMLPreElement, {}, info.initializedElmAppsStatus.message)
        ];
      case "MissingWindowElm":
        return [
          h(
            HTMLParagraphElement,
            {},
            "elm-watch requires ",
            h(
              HTMLAnchorElement,
              {
                href: "https://lydell.github.io/elm-watch/window.Elm/",
                target: "_blank",
                rel: "noreferrer"
              },
              "window.Elm"
            ),
            " to exist, but it is undefined!"
          )
        ];
      case "NoProgramsAtAll":
        return [
          h(
            HTMLParagraphElement,
            {},
            "It looks like no Elm apps were initialized by elm-watch. Check the console in the browser developer tools to see potential errors!"
          )
        ];
      case "DebuggerModeStatus": {
        const compilationModes = [
          {
            mode: "debug",
            name: "Debug",
            status: info.initializedElmAppsStatus.status
          },
          { mode: "standard", name: "Standard", status: { tag: "Enabled" } },
          { mode: "optimize", name: "Optimize", status: { tag: "Enabled" } }
        ];
        return [
          h(
            HTMLFieldSetElement,
            { disabled: sendKey === void 0 },
            h(HTMLLegendElement, {}, "Compilation mode"),
            ...compilationModes.map(({ mode, name, status }) => {
              const nameWithIcon = h(
                HTMLSpanElement,
                { className: CLASS.compilationModeWithIcon },
                name,
                mode === selectedMode ? compilationModeIcon(mode) : void 0
              );
              return h(
                HTMLLabelElement,
                { className: status.tag },
                h(HTMLInputElement, {
                  type: "radio",
                  name: `CompilationMode-${info.targetName}`,
                  value: mode,
                  checked: mode === selectedMode,
                  disabled: sendKey === void 0 || status.tag === "Disabled",
                  onchange: sendKey === void 0 ? void 0 : () => {
                    dispatch({
                      tag: "ChangedCompilationMode",
                      compilationMode: mode,
                      sendKey
                    });
                  }
                }),
                ...status.tag === "Enabled" ? [
                  nameWithIcon,
                  warnAboutCompilationModeMismatch && mode === selectedMode && selectedMode !== info.originalCompilationMode && info.originalCompilationMode !== "proxy" ? h(
                    HTMLElement,
                    { localName: "small" },
                    `Note: The code currently running is in ${ORIGINAL_COMPILATION_MODE} mode.`
                  ) : void 0
                ] : [
                  nameWithIcon,
                  h(HTMLElement, { localName: "small" }, status.reason)
                ]
              );
            })
          )
        ];
      }
    }
  }
  var DATA_TARGET_NAMES = "data-target-names";
  function updateErrorOverlay(targetName, dispatch, sendKey, errors, overlay, overlayCloseButton) {
    const existingErrorElements = new Map(
      Array.from(overlay.children, (element) => [
        element.id,
        {
          targetNames: new Set(
            (element.getAttribute(DATA_TARGET_NAMES) ?? "").split("\n")
          ),
          element
        }
      ])
    );
    for (const [id, { targetNames, element }] of existingErrorElements) {
      if (targetNames.has(targetName) && !errors.has(id)) {
        targetNames.delete(targetName);
        if (targetNames.size === 0) {
          element.remove();
        } else {
          element.setAttribute(DATA_TARGET_NAMES, [...targetNames].join("\n"));
        }
      }
    }
    let previousElement = void 0;
    for (const [id, error] of errors) {
      const maybeExisting = existingErrorElements.get(id);
      if (maybeExisting === void 0) {
        const element = viewOverlayError(
          targetName,
          dispatch,
          sendKey,
          id,
          error
        );
        if (previousElement === void 0) {
          overlay.prepend(element);
        } else {
          previousElement.after(element);
        }
        overlay.style.backgroundColor = error.backgroundColor;
        overlayCloseButton.style.setProperty(
          "--foregroundColor",
          error.foregroundColor
        );
        overlayCloseButton.style.setProperty(
          "--backgroundColor",
          error.backgroundColor
        );
        previousElement = element;
      } else {
        if (!maybeExisting.targetNames.has(targetName)) {
          maybeExisting.element.setAttribute(
            DATA_TARGET_NAMES,
            [...maybeExisting.targetNames, targetName].join("\n")
          );
        }
        previousElement = maybeExisting.element;
      }
    }
    const hidden = !overlay.hasChildNodes();
    overlay.hidden = hidden;
    overlayCloseButton.hidden = hidden;
    overlayCloseButton.style.right = `${overlay.offsetWidth - overlay.clientWidth}px`;
  }
  function viewOverlayError(targetName, dispatch, sendKey, id, error) {
    return h(
      HTMLDetailsElement,
      {
        open: true,
        id,
        style: {
          backgroundColor: error.backgroundColor,
          color: error.foregroundColor
        },
        attrs: {
          [DATA_TARGET_NAMES]: targetName
        }
      },
      h(
        HTMLElement,
        { localName: "summary" },
        h(
          HTMLSpanElement,
          {
            className: CLASS.errorTitle,
            style: {
              backgroundColor: error.backgroundColor
            }
          },
          error.title
        ),
        error.location === void 0 ? void 0 : h(
          HTMLParagraphElement,
          {},
          viewErrorLocation(dispatch, sendKey, error.location)
        )
      ),
      h(HTMLPreElement, { innerHTML: error.htmlContent })
    );
  }
  function viewErrorLocation(dispatch, sendKey, location) {
    switch (location.tag) {
      case "FileOnly":
        return viewErrorLocationButton(
          dispatch,
          sendKey,
          {
            file: location.file,
            line: 1,
            column: 1
          },
          location.file.absolutePath
        );
      case "FileWithLineAndColumn": {
        return viewErrorLocationButton(
          dispatch,
          sendKey,
          location,
          `${location.file.absolutePath}:${location.line}:${location.column}`
        );
      }
      case "Target":
        return `Target: ${location.targetName}`;
    }
  }
  function viewErrorLocationButton(dispatch, sendKey, location, text) {
    return sendKey === void 0 ? text : h(
      HTMLButtonElement,
      {
        className: CLASS.errorLocationButton,
        onclick: () => {
          dispatch({
            tag: "PressedOpenEditor",
            file: location.file,
            line: location.line,
            column: location.column,
            sendKey
          });
        }
      },
      text
    );
  }
  if (typeof WebSocket !== "undefined") {
    run();
  }
})();
(function(scope){
'use strict';

var _Platform_effectManagers = {}, _Scheduler_enqueue; // added by elm-watch

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

// This function was slightly modified by elm-watch.
function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		// c: null // commented out by elm-watch
		c: Function.prototype // added by elm-watch
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			// }); // commented out by elm-watch
			}) || Function.prototype; // added by elm-watch
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


// This function was slightly modified by elm-watch.
var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		"Platform.worker", // added by elm-watch
		false, // isDebug, added by elm-watch
		debugMetadata, // added by elm-watch
		flagDecoder,
		args,
		impl.init,
		// impl.update, // commented out by elm-watch
		// impl.subscriptions, // commented out by elm-watch
		impl, // added by elm-watch
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


// This whole function was changed by elm-watch.
function _Platform_initialize(programType, isDebug, debugMetadata, flagDecoder, args, init, impl, stepperBuilder)
{
	if (args === "__elmWatchReturnData") {
		return { impl: impl, debugMetadata: debugMetadata, flagDecoder : flagDecoder, programType: programType };
	}

	var flags = _Json_wrap(args ? args['flags'] : undefined);
	var flagResult = A2(_Json_run, flagDecoder, flags);
	$elm$core$Result$isOk(flagResult) || _Debug_crash(2 /**/, _Json_errorToString(flagResult.a) /**/);
	var managers = {};
	var initUrl = programType === "Browser.application" ? _Browser_getUrl() : undefined;
	globalThis.__ELM_WATCH.INIT_URL = initUrl;
	var initPair = init(flagResult.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);
	var update;
	var subscriptions;

	function setUpdateAndSubscriptions() {
		update = impl.update || impl._impl.update;
		subscriptions = impl.subscriptions || impl._impl.subscriptions;
		if (isDebug) {
			update = $elm$browser$Debugger$Main$wrapUpdate(update);
			subscriptions = $elm$browser$Debugger$Main$wrapSubs(subscriptions);
		}
	}

	function sendToApp(msg, viewMetadata) {
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	setUpdateAndSubscriptions();
	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	function __elmWatchHotReload(newData, new_Platform_effectManagers, new_Scheduler_enqueue, moduleName) {
		_Platform_enqueueEffects(managers, _Platform_batch(_List_Nil), _Platform_batch(_List_Nil));
		_Scheduler_enqueue = new_Scheduler_enqueue;

		for (var key in new_Platform_effectManagers) {
			var manager = new_Platform_effectManagers[key];
			if (!(key in _Platform_effectManagers)) {
				_Platform_effectManagers[key] = manager;
				managers[key] = _Platform_instantiateManager(manager, sendToApp);
				if (manager.a) {
					console.info("elm-watch: A new port '" + key + "' was added. You might want to reload the page!");
					manager.a(key, sendToApp)
				}
			}
		}

		for (var key in newData.impl) {
			if (key === "_impl" && impl._impl) {
				for (var subKey in newData.impl[key]) {
					impl._impl[subKey] = newData.impl[key][subKey];
				}
			} else {
				impl[key] = newData.impl[key];
			}
		}

		var newFlagResult = A2(_Json_run, newData.flagDecoder, flags);
		if (!$elm$core$Result$isOk(newFlagResult)) {
			return { tag: "ReloadPage", reason: "the flags type in `" + moduleName + "` changed and now the passed flags aren't correct anymore. The idea is to try to run with new flags!\nThis is the error:\n" + _Json_errorToString(newFlagResult.a) };
		}
		if (!_Utils_eq_elmWatchInternal(debugMetadata, newData.debugMetadata)) {
			return { tag: "ReloadPage", reason: "the message type in `" + moduleName + '` changed in debug mode ("debug metadata" changed).' };
		}
		init = impl.init || impl._impl.init;
		if (isDebug) {
			init = A3($elm$browser$Debugger$Main$wrapInit, _Json_wrap(newData.debugMetadata), initPair.a.popout, init);
		}
		globalThis.__ELM_WATCH.INIT_URL = initUrl;
		var newInitPair = init(newFlagResult.a);
		if (!_Utils_eq_elmWatchInternal(initPair, newInitPair)) {
			return { tag: "ReloadPage", reason: "`" + moduleName + ".init` returned something different than last time. Let's start fresh!" };
		}

		setUpdateAndSubscriptions();
		stepper(model, true /* isSync */);
		_Platform_enqueueEffects(managers, _Platform_batch(_List_Nil), subscriptions(model));
		return { tag: "Success" };
	}

	return Object.defineProperties(
		ports ? { ports: ports } : {},
		{
			__elmWatchHotReload: { value: __elmWatchHotReload },
			__elmWatchProgramType: { value: programType },
		}
	);
}

// This whole function was added by elm-watch.
// Copy-paste of _Utils_eq but does not assume that x and y have the same type,
// and considers functions to always be equal.
function _Utils_eq_elmWatchInternal(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp_elmWatchInternal(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp_elmWatchInternal(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

// This whole function was added by elm-watch.
function _Utils_eqHelp_elmWatchInternal(x, y, depth, stack)
{
	if (x === y) {
		return true;
	}

	var xType = _Utils_typeof_elmWatchInternal(x);
	var yType = _Utils_typeof_elmWatchInternal(y);

	if (xType !== yType) {
		return false;
	}

	switch (xType) {
		case "primitive":
			return false;
		case "function":
			return true;
	}

	if (x.$ !== y.$) {
		return false;
	}

	if (x.$ === 'Set_elm_builtin') {
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	} else if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin' || x.$ < 0) {
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}

	if (Object.keys(x).length !== Object.keys(y).length) {
		return false;
	}

	if (depth > 100) {
		stack.push(_Utils_Tuple2(x, y));
		return true;
	}

	for (var key in x) {
		if (!_Utils_eqHelp_elmWatchInternal(x[key], y[key], depth + 1, stack)) {
			return false;
		}
	}
	return true;
}

// This whole function was added by elm-watch.
function _Utils_typeof_elmWatchInternal(x)
{
	var type = typeof x;
	return type === "function"
		? "function"
		: type !== "object" || type === null
		? "primitive"
		: "objectOrArray";
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


// This whole function was changed by elm-watch.
function _Platform_export(exports)
{
	var reloadReasons = _Platform_mergeExportsElmWatch('Elm', scope['Elm'] || (scope['Elm'] = {}), exports);
	if (reloadReasons.length > 0) {
		throw new Error(["ELM_WATCH_RELOAD_NEEDED"].concat(Array.from(new Set(reloadReasons))).join("\n\n---\n\n"));
	}
}

// This whole function was added by elm-watch.
function _Platform_mergeExportsElmWatch(moduleName, obj, exports)
{
	var reloadReasons = [];
	for (var name in exports) {
		if (name === "init") {
			if ("init" in obj) {
				if ("__elmWatchApps" in obj) {
					var data = exports.init("__elmWatchReturnData");
					for (var index = 0; index < obj.__elmWatchApps.length; index++) {
						var app = obj.__elmWatchApps[index];
						if (app.__elmWatchProgramType !== data.programType) {
							reloadReasons.push("`" + moduleName + ".main` changed from `" + app.__elmWatchProgramType + "` to `" + data.programType + "`.");
						} else {
							var result;
							try {
								result = app.__elmWatchHotReload(data, _Platform_effectManagers, _Scheduler_enqueue, moduleName);
								switch (result.tag) {
									case "Success":
										break;
									case "ReloadPage":
										reloadReasons.push(result.reason);
										break;
								}
							} catch (error) {
								reloadReasons.push("hot reload for `" + moduleName + "` failed, probably because of incompatible model changes.\nThis is the error:\n" + error + "\n" + (error ? error.stack : ""));
							}
						}
					}
				} else {
					throw new Error("elm-watch: I'm trying to create `" + moduleName + ".init`, but it already exists and wasn't created by elm-watch. Maybe a duplicate script is getting loaded accidentally?");
				}
			} else {
				obj.__elmWatchApps = [];
				obj.init = function() {
					var app = exports.init.apply(exports, arguments);
					obj.__elmWatchApps.push(app);
					globalThis.__ELM_WATCH.ON_INIT();
					return app;
				};
			}
		} else {
			var innerReasons = _Platform_mergeExportsElmWatch(moduleName + "." + name, obj[name] || (obj[name] = {}), exports[name]);
			reloadReasons = reloadReasons.concat(innerReasons);
		}
	}
	return reloadReasons;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

// This whole function was changed by elm-watch.
var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	var programType = "Html";

	if (args === "__elmWatchReturnData") {
		return { virtualNode: virtualNode, programType: programType };
	}

	/**_UNUSED/ // always UNUSED with elm-watch
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	var nextNode = _VirtualDom_render(virtualNode, function() {});
	node.parentNode.replaceChild(nextNode, node);
	node = nextNode;
	var sendToApp = function() {};

	function __elmWatchHotReload(newData) {
		var patches = _VirtualDom_diff(virtualNode, newData.virtualNode);
		node = _VirtualDom_applyPatches(node, virtualNode, patches, sendToApp);
		virtualNode = newData.virtualNode;
		return { tag: "Success" };
	}

	return Object.defineProperties(
		{},
		{
			__elmWatchHotReload: { value: __elmWatchHotReload },
			__elmWatchProgramType: { value: programType },
		}
	);
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

// This function was slightly modified by elm-watch.
var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		impl._impl ? "Browser.sandbox" : "Browser.element", // added by elm-watch
		false, // isDebug, added by elm-watch
		debugMetadata, // added by elm-watch
		flagDecoder,
		args,
		impl.init,
		// impl.update, // commented out by elm-watch
		// impl.subscriptions, // commented out by elm-watch
		impl, // added by elm-watch
		function(sendToApp, initialModel) {
			// var view = impl.view; // commented out by elm-watch
			/**_UNUSED/ // always UNUSED with elm-watch
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				// var nextNode = view(model); // commented out by elm-watch
				var nextNode = impl.view(model); // added by elm-watch
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

// This function was slightly modified by elm-watch.
var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		impl._impl ? "Browser.application" : "Browser.document", // added by elm-watch
		false, // isDebug, added by elm-watch
		debugMetadata, // added by elm-watch
		flagDecoder,
		args,
		impl.init,
		// impl.update, // commented out by elm-watch
		// impl.subscriptions, // commented out by elm-watch
		impl, // added by elm-watch
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			// var view = impl.view; // commented out by elm-watch
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				// var doc = view(model); // commented out by elm-watch
				var doc = impl.view(model); // added by elm-watch
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


// This function was slightly modified by elm-watch.
function _Browser_application(impl)
{
	// var onUrlChange = impl.onUrlChange; // commented out by elm-watch
	// var onUrlRequest = impl.onUrlRequest; // commented out by elm-watch
	// var key = function() { key.a(onUrlChange(_Browser_getUrl())); }; // commented out by elm-watch
	var key = function() { key.a(impl.onUrlChange(_Browser_getUrl())); }; // added by elm-watch

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(impl.onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			// return A3(impl.init, flags, _Browser_getUrl(), key); // commented out by elm-watch
			return A3(impl.init, flags, globalThis.__ELM_WATCH.INIT_URL, key); // added by elm-watch
		},
		// view: impl.view, // commented out by elm-watch
		// update: impl.update, // commented out by elm-watch
		// subscriptions: impl.subscriptions // commented out by elm-watch
		view: function(model) { return impl.view(model); }, // added by elm-watch
		_impl: impl // added by elm-watch
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.multiline) { flags += 'm'; }
	if (options.caseInsensitive) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$AB$ExampleA = {$: 'ExampleA'};
var $author$project$AB$MoveHorizontally = {$: 'MoveHorizontally'};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $author$project$AB$chamberWidth = 7;
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$AB$Left = {$: 'Left'};
var $author$project$AB$Right = {$: 'Right'};
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Result$toMaybe = function (result) {
	if (result.$ === 'Ok') {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$AB$collectResults = function (list) {
	var oks = A2($elm$core$List$filterMap, $elm$core$Result$toMaybe, list);
	var errors = A2(
		$elm$core$List$filterMap,
		function (result) {
			if (result.$ === 'Err') {
				var error = result.a;
				return $elm$core$Maybe$Just(error);
			} else {
				return $elm$core$Maybe$Nothing;
			}
		},
		list);
	return $elm$core$List$isEmpty(errors) ? $elm$core$Result$Ok(oks) : $elm$core$Result$Err(errors);
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $author$project$AB$isWhitespace = function (_char) {
	return _Utils_eq(
		_char,
		_Utils_chr(' ')) || (_Utils_eq(
		_char,
		_Utils_chr('\t')) || (_Utils_eq(
		_char,
		_Utils_chr('\n')) || _Utils_eq(
		_char,
		_Utils_chr('\u000D'))));
};
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (ra.$ === 'Ok') {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$AB$parse = function (input) {
	return A2(
		$elm$core$Result$map,
		$elm$core$Array$fromList,
		$author$project$AB$collectResults(
			A2(
				$elm$core$List$map,
				function (_char) {
					switch (_char.valueOf()) {
						case '<':
							return $elm$core$Result$Ok($author$project$AB$Left);
						case '>':
							return $elm$core$Result$Ok($author$project$AB$Right);
						default:
							return $elm$core$Result$Err(
								'Invalid character: ' + $elm$core$String$fromChar(_char));
					}
				},
				A2(
					$elm$core$List$filter,
					A2($elm$core$Basics$composeL, $elm$core$Basics$not, $author$project$AB$isWhitespace),
					$elm$core$String$toList(input)))));
};
var $author$project$Input$example = '>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>';
var $author$project$Input$input = '>><><<>><<<>>>><<>>>><<<<><<>>>><<>><<>>>><>>><<>>>><<>>>><<<>>>><<<<><<<<>><<>><><<><>>>><>><>>><<<<>>>><<><<>>><<>><<><>>><<<>><>>><<>>>><>>>><<<>><>><<<<><<<<>><<>><<<<>><>>><<>><<>><<<>>>><<<>>><<>>>><<>><<>>>><<<<>>>><<>><<<>><<>><<><<<<>><>><<<>><<<>>>><<<>><<<>><<<<><><<>><>>>><<<<><>>>><<>>>><<>>>><<<>>>><<>>><<<>>>><<>>><<<<>><<<>>>><>>>><<<>>><>>>><<>><<<>>><>>>><<<>>><<><<<>><<<<><>>><<<<><<<<>>>><<>>><<<>><<<<><><>>>><<<<>>>><<<<>>>><<>><<<>>><><>>>><<>>>><<><<<><<>>>><<<>>>><<>><<<><>>><<<>><<<><<<<><<<<><>>>><<>>>><<<><><>><<>>><<<>>><<>>>><<>><<<>><<<>>><<>>><<<>>>><<<>>>><>>>><>>>><<<>><<<><<>>><<<<>>>><<<>>><>>><<<<>>><<<>>><<<<>>>><><<><<><<><><><<<<><<><<>>><<<>><<<<>>><<<>>><>>><<><<>>>><<><<<<><<><<<<>><>>>><<>><<<>>>><<<<>>><<<<>><<<><<<><>><<<<>><<><<<>>>><>><>>><>>>><<<>><<>><<<>>><<>>><<<<><<>>><>><>><<<>>>><<>>>><<<><>><<<><<<>>><<<<>>><<>><><<<<>><><<<>>><<<>><<<<><<<><>>><<<<>>>><<<<><<>><<<>>>><<<<><<<>>>><<><<>>><<<>>><>>><><><<><<<<>>><><>>><>>>><>>>><<>><<<<>>>><<>>>><>>>><<>>><>>><<>><<<>>>><<<>><<<<>><<>>>><<<<><<<<>>>><>>><>>><<<<>>>><<<<>><>>>><<<><>>>><<<>><<>>><<>>><<><<<><><<<<><<<<>>>><<<<><<>>><<<<><<<<>><<><<>>><<><>><<<<>>>><>>><>><<<>>>><<<<>>><<>>><>>>><<<<>>><<<<><<>>>><>><<<>>><<<<>>><<><<<>><<>>><<<>><<>><>>>><>>>><>><<<>>><><<<>>><<>>>><>>>><<>><>><<>>><<<<>>>><><<<>>><<<<>>><<<<><<<>>><<>>><<<>><<<>><<>>>><<<>>><<<><<><>>><<<<><<>>>><<<><>>>><<>><<<><<<><>><>>><<><<<>><><<<>>><<<><>><<<>><>>>><>><<<><<<><<<<>>>><<>>>><<>>><<<><<<<>>>><<<<>>>><<<>><<<<><<<><<<<>>><<>>><<>><>><<<<>><<<<>><<><<<<>><<<>>><>>>><<>><<<>>>><<<>><<<<>>>><<<>>><<>>><<>>><<>>>><<<<>>><<<<><><<<>>><<<<>>>><<<<><><<<><>><<>>><<>>>><>>><<<<>><>><><<><<>>><<>>>><>>>><<>>>><><<<>>><><<>>>><<>>><><<>><<<>>>><<>>>><<<>>><<<<>><<<>>>><<<<>>><>><>>><<>>>><<<<>><<>>><<>>>><>>>><><<<<>>>><>>><><<<<>><<>>>><<<><<>>>><<>>><>>>><<<>>><<<<><>>>><<<<>>>><<><<>>><<<<><<<<><<<<>><<><<<<><<<<>>>><<<<>>><<<<>>><<<><><>><>><>>>><>><<<<>>>><<<<>>>><<<<><<><<<>>><>>><>>><<<>>>><<<>>><<<>><<<<>>>><<><>>>><><<<<>><<<>>>><<<>><<<<>>>><<<<>>>><<>><<>>><>>><<>>><>><<<><>>><>><<>><<><<<>><<<>>>><<>>><<<<>><<<>><<<<><<<<><>><<<>>>><><<>>><>>>><<>><<<>>><><>><<><<<>><<>>>><>>><<>>>><<<<><<><<>><<><<<>><<>>><<<<>>><<<<>><><<><<<<>><<>>><<>>>><<<<>>>><<>>><>>><>>>><<>><<<<><<>>>><>>>><<>><<>>><<>>><<>>>><<<><<<>>><<<<>><<<<>>><<>>><<>><>>>><<<<>><<<>>>><>>><<<><><><<>>><<<<>>>><<><<>>><<<<>>><<<<>>>><<<><<<>>>><<>><<>>><<<<>>>><<><<<>>>><<>>>><<<<><<>>><<>>><>>>><><<<<>>><<>>>><<>><>>><>><>>><<>><<>>><<>>>><<<<>>>><<<<><<<>>><<<<>><<>>>><>>>><<>>>><>>>><<>>>><<<<>>><>>>><<<<><<<<>>>><<<<>><<<<><>>><><><><<<>>>><>>><><<<<>><<>>><<>><>><<><><<<><<>><><<><<<>><<<<><>>>><<>>>><<<>><>>>><>>><<<<>>>><<<>>>><<>>>><<<>>><<<><<<>><<><<<>>><<>>><<<<>>>><<>>>><<<>><<>>><<<>>><<<>><<<><>><<<<>>>><<<>>>><<<<><><<>><>>><<<<>><>>><<<><<<<><<<<>>>><>><<><<<<>>><<<>>><>><<<<>>><<<<><<<<>><<<<><<<><<<>>>><<<<>>><>><<>>>><<<<>>>><<<<>>><<>>>><<><<<><>><<<>><<<<>>><>>><<<<>>>><<>>><<<<>>><<><<><<<<>><<<>>><><>>>><<><<<>><<>><<<<>>>><<<<>>><>><<<>><<<>>><<>><><<<><<<<><<<>>>><<<<>>>><<>>><<><<<>><<<><><<<><<><<<>><>><><>><<>>><<>>><><<<>><>><<>>>><<>>><<<>><><<<><<<><<<>><<<<><<<><<>>>><<<<><<<<>>>><<<><<<<>><<<>><<<<>><<<<>>>><>>>><<>><<<<>>><<<><<>>>><<<>><<<<>>>><<<><<>>>><<<><<<>>><<<<><<<<>><<>>><<>>><<<>>><>>><<<>>>><<<<><<<<>>><><>>>><<<>>><<<<>>><<>><<<<>><><>>>><<<>><<>>><<><<<>>><>><<<>>><<<<>>><<<<>>>><<<>><<<>>>><<<<>><<<<><<>>><>>>><<<><<<<>><<<<><<<<><<<>><<><<<>>>><><<<><<><<<>>>><<<>>>><>><<<>>><<<<>>>><<>>><<<<>>>><<<<>>><<><<><<<<>>>><><>><<<<>><<<>><<<<>>>><<<<><<<>><<>>>><<<>><<<<><<<>><<>>>><>>>><>><<>><<<<><<<><<<><>><<>>>><><<<<>>>><<<><<<><>><>><<>>><<<>><<<><<<<>><<>>><<<<>>>><<<<>>><<><<>>>><<<<>>><<>>>><<<>>><>>>><<<><<>>>><<<<>>><<<<>>><<<<><<>>>><>>>><<>><<<>><<<><<<<>><<<>>>><<><<>>><>><<><<<>><>><>><<<>><<<>>><<>><>>>><<<<><<>>><<<>><<<>>>><<<>>><>>>><<><<<<>>>><<<>>><<><<<<>><<<>>>><<<>>>><<<<>><>>>><<<>>><<<<>>>><<<>><<<>>>><<>>>><<<<>><<<>>><<<>>><<<<>>><>><<<<><<<><<>>><>>>><><>>><<<>><<>><<>>><>>><>><>>><><<<>>>><>>><<<<>>><<<>><<<>><<<<><<>>>><<>><<<>>>><<<><<<>>><<<>><<><<<<>>>><<<<>><<>>><<<>><>>>><<<><<<<>><<<<><><<<>><>>><<>><<<>><<>><<<>><>><<>>><<<<><<<<>><<<<>>>><<<<><<<><<>><<<<>>><<<<><>>>><<<>><<><<<<>><<><>>><<<<>><>><<<><<>>>><>><<><<<<>>><>><<<<><<<<>>>><<<<>>><>><>>>><<<>>>><><<<<><<<<>>><<<><<<>><<>><<<<><<<>><<>><<<>><<<<>>>><<<<>>><<><<<<>><<>>><<>>>><<<>>>><<>>><<><>><<>><>><<<<>><<<>>>><>>><><<<>>><><<><<<><<>><<><<>><>>>><<<<><>>>><<<<>>><<<<>><<<>>><<<><><<<<>><<<><<<><<<><<<><<>>>><<<><<<<>>><<<><<<>><<<>>>><<>>><<>><<<<>>><>><<<<>>><<<><<<><<<<><>><><>><<<<>>><<<>>>><>><>>><<<>>>><<<<>>>><<<>><<<<>>>><<<>>><<><<<<>>>><<><<><<><>>><>>><<<>>><<<<>>><<<>><<<>><<>>>><<<<>><<<>><<<><<<<><<<>>><<<<>>><<><<>>>><>><>>>><<<<><>><<<<>>>><<>>>><<>>>><><<<<>><<<<>><<<>>><<><>><<>>>><<<><>><>><<>>>><<>>>><<>><>><>>><<<>><<<<><<<>><<>>><<>>><<<<><<<<><<>>><<>>><<<<>>><<<<>><<<<>>><>>><<<<>><<<<>><<>>>><<>>><<<<>><<<<>>>><<<>><>>><><>><>>><<><>>><<<>>>><>><>><><<<>>><>><>>>><>><><<<>>><<>>><<>>><>>>><<<<>><<<>>>><<>>><<<<>><<>><>>><<><<>>>><<<><>>>><>>><<>><<>><<<<><>><<<<><<>>><>>><>><>><<<<>><<<>><>>><<<<><<<>>>><<<<>><>>>><<<>><<<>>>><<<<><<<<>><<<<><<>><<<>>>><<<>>><<>>>><>><<>><<<<>>><<<>><>><>>><<>><<<<>>>><<<<>><<<>>><<<>><<<<><<><<<>>><<<<>><<<>><<>>>><<>>>><>><<<>>><<>><>><>>>><<<<><<<>>>><<<<>>><<<<>>>><<>>><<<<>>>><<<><><<>>><<<<>>><>>>><<>>><<<>>>><<<<><<<>>>><>>><<<><<<>><<><<<<><<<><<><<<<><<<><<<>><><<<>>>><<>>><<<<><<<<><<<<>>><<<<><><<<<><<>>><<<<>><><>>><<<<>><<<<>><<<>>>><<>>>><<<<>><>>>><<<<>><<<<>>><><<<<>><<<><<<<>>>><<<<>>>><<<<>>>><<<<><<<>>>><>><<<<>>><<><><<<<>>><>><<<>>>><<<>><<<<><>><<><<<><<<>>><<>>><<<>>>><<<>>><<<>>><>>>><<<><<<<>>>><<<<>>><<<<>><>>><<>>><<<<>>><>><<<>><<<>><<<<><<<>><<<<>>>><>><<>><<<>><<<>>>><<<<><<<<>><>>><<>><<<<><<<>>>><<<<><<<<><<>>>><<<>>>><<<>>>><<<>><<><<<<>>>><<>><<<<>>><<><<<><><>>>><<<<>>>><>><<><<<><<<>><<<<><><<<>>>><<<<><>>>><<<<>>><<>><<><<<>>>><<<>>><<<>><<>>><>><<<>>>><<>>><<>>>><>>>><<<>>><><<<<>>>><<<>><<<<>>><<<<>><>><<<<>>><>>>><<<>>>><<<>>><>>><<<><>>>><>>><<<>>>><<<<>>><<<<><<<<>>><><<<<>><<><<<<>>><<<<>><>><<<<><<>><<><<<>>>><<<><<<><<>>><>>>><<<<><<<<>>><<<>>><>>>><<<<>><<<>>><<<>>>><<>>><<<<><<<<>>><<<>>><<>><>>><<<<>>>><><<>>><<>>>><<<>><><>><<>>><<<<>>><><<<>><>><<<<>>>><<<<><<<<><<<<><<>><<><<>>>><<<<>>>><<<>>>><<<<>>><<<>>><<>><><<<>>><><>><<<<>><<<<>>>><<<<>>><>><<>><<>><<<<>><<<<><<>>><<<<>>><<<>>>><>>><<<<><<<>>><>>><<<>>>><<>><>>>><<<<>>><<<<>>><<>><<><<><>>><<<><>>>><>>><<<>><<<>>>><<<<>>>><<><<<<>><<><<<<>>><<<>>><<<<>>>><<<><<<>>>><>>>><<><<<<>><<<>>><<<>>><<<<>>><>>>><<<>>><<<<>>><>><<>><<<<>><<>><<<<>>>><<>><>><<<<>>><><><<<<><<>>>><<>>>><<><<<><>>><<>>>><<<<>><<<<>>><<<>>><<>><<<>><<<>>><<<>>><<<<>>><<<>><>>><><<<<><>>><<<<><<>>>><<<><<<>>>><>>>><<<<><<<<>><<><<<<><<>><<<<>>>><<<<>><>>>><<<>><<<<>><<<>>>><>>>><<>>>><<<>>>><<>><<>>>><<<><<<>>>><<<>>><<>>><<<>>><<><<<>><<>><<>>>><<<<>>><<<<>>><>>><<<<>><<<>>>><>>><><<<<>>>><>><<<<>><<>>>><<<<><<<>>><<<<><<<>><<<><>><>>><<<<>><<>>>><>>><<<<><><<<<><<>>><<<<>>><<<>>>><>><<<<>>>><<<>>>><<>><>><<<<>>><<>>>><>>>><<<<><<<<>>>><<<><<><<<<>>>><<><><<<<><<<><<<>>>><>><<>>>><<>><<<<><<<><>><>>>><<<>><<>>><<><<>><<<<>><<<<>>>><<<<><<><<<>>><<<<>><<<><<<>>>><<<<>>><<<<>>><<>>><>><<>>>><<<>><<<>>><<<>>><<<<>>>><>><>>>><<<<>><>>><<<>><<><<<>>><<<>>><<<>>>><<<>>><<<><<<<>><><<><><<<<>>>><>><><>>><<<<>>>><<>><<>>>><<>><<>>>><><><><<<<>>><<<>>>><>>>><<>><<<>><<<>>><>>><>>><>>><<<>><>><<<<>>><<<<>>><<<<>><<>>><<<<>>>><<<<>>>><<><<<><<>>><<>>>><<<<>>><<<<>>>><<<>>>><<<>>><<<<>><><<<<>>><<<<><>>><>>>><<<<><<>>>><<<<>>>><<<<>><<<<><<<<>>><<<<>>><<<>>><<<>>><<<>><>><<<<><>><<<<>>>><>>><<<><<<<>>>><>>><<<>>>><<<<>>><<<<>>>><<<>><<>>><<<<>>><<><<>><<>>><<>><<<<>><<>><>><<<>><<>>>><><<<>><<<<><<<><<>>>><>><<>><<<>>>><<>>>><<<>>>><<<<><<<>>>><<>>><<><<><<>>>><<>>>><<<<>>>><<>><<<<>><<<><><>>>><<<<><>>>><<<<>>><<>>>><<<<>>><>>><<<<>>><<>>><<>><<>>><>>>><<<<>><<<<>><<>>><><>><>><<<>>>><<<<>>>><<<<>><<><<<>>><<<<>><<<<>><<>>><<>>>><>>>><<>><>>><<<<>>><<<><>>><<>>><><<>><<<><<<<>>>><<<<><<<<>><<>><>>>><<>><<>>>><>>>><>>><<><>><<>><>>>><<<>>><<<>>><<>>><<<<>>>><<<>>><>><>>><<><<<>>>><<>><>>><<<><<>><<<><<<>><<<>>><<<<><><<<><<<<>>>><<<<>>>><<<>>><<<<>>><<<><<>><<<<><<>>>><<<<>>><<<<><><>>>><<>>><<<>>><>>>><<><<<><<<>>><<<<>>>><>>>><>><<><><<>>>><>><<<><<<<>><<<<>><>>>><<>><<<<>>><<<>>><<<>>><<<<>>><<>>><<<<>>>><<<<>>><<><<<>>><<<>><<<<><><<<<>><><<<<>>>><<<<><>>><>>>><<<><<<>>><<<><<<<>><<<<>>>><<><>>><<<><<<<>>>><<<><<<<>>><<>>>><<<>><<<<>><><<><><<>>>><<<>><><<<><<<<><<<<>>><<>>>><<<<>>>><<<<>><<<<>>><>>><<<<>>><<<<>>><<<>>><>>><>>>><<<>><<><<<<>><>><<<>>><<><>><>>>><<<<>><<<<>><<>>>><<<>>><<>><<<<>><<<<>><<<<><<><<<<>>><<<<>>>><<<>>><><<<<><><<<<>>><<<>>>><>>><>>><<>>><<<><>><<><>><>><<>>><<<<>>><<<<>>><<<<><>><<<<><<<>><<<>>>><<>>><<<>>><<>><<>>>><><>>><<<>><<><<<<>>>><>><<<<>><<<>>>><<>>><<<<>>><<<>>>><<<>>>><<<><<><<<<>>><<<>>>><<>>><<<>>>><><<<<>>>><<>>>><<<>>><<<<><<<>><<>>>><<<<>>><>>><<<<>><<<<><<<<><<<>>><>><<<>>>><<>><<<<>>>><><<<<>>><<<>><<>>><>>><<<>>>><<>><>>>><<<>><<>><<<>>><>>><<<<>>>><<><>>>><<<<>><<>>>><>>><<<<>><<<<><<><<><>>><>>><<<<>>>><><<>>>><<<>><<<>>><<>>>><<<<><<<<><>><<<<>>><<<<>>><>><>><<<>>>><<<>>>><<<>><>><<><<>>>><>>>><<>><>>>><<<><<<<><<<>>>><<>>><>>><>>><<<<>><<>>><<<<><<<<>>>><>><<<>>><>>>><<<<><>>><<<<>>>><>>><<<><>>>><>>>><>><<<<>>><<><<<<>>><<<<>>>><<<<><>>><<<<><<>>>><>>><<>>><<>>><<>>>><<<<>>>><<<>>>><<>>>><<<<>>><><><>>><<>>>><<<>><<>>>><<<<>>><<>>>><<<<>><<<><<<<><>>>><>>><<<>><>>><<<>><>>>><<<>>><<>>><<<><<<<>>><<>>>><<<<><>><>><<><<>>>><<<>>><<<<>><<<<>><<<><<<<>><<<<><<<<>>><<<>>><><<<><<<<><<<<>><<<<>><<><<<<>><<<><><>><<<>><>><<>>><<>>><>>><<>>>><<><<<>><<>><<<<>>>><><<>><<><<<<>>>><>>><<<<>>><>>>><<<>>><<<<>>><<<>>><<<>>><<<<><<<<>>><<<<><<><<>>><<<><<<>>><<<<>>>><<<><<<<>>><<<>><<<>>><<<<>>>><<<<>><<<<>>><<<>>><<<>><<<>>>><<<>>>><>><<<<>>><>>><>>><>>>><<<<>>>><>>><<<<><<<<>>><><<>>><<<<>>><<<>>><<<<><<<>>>><<<>>>><<>>><<>>>><<>><<<';
var $author$project$AB$partToInput = function (part) {
	switch (part.$) {
		case 'ExampleA':
			return $author$project$Input$example;
		case 'ExampleB':
			return $author$project$Input$example;
		case 'FullA':
			return $author$project$Input$input;
		case 'FullB':
			return $author$project$Input$input;
		default:
			var input = part.a.input;
			return input;
	}
};
var $author$project$AB$partToLimit = function (part) {
	switch (part.$) {
		case 'ExampleA':
			return 2022;
		case 'ExampleB':
			return 1000000000000;
		case 'FullA':
			return 2022;
		case 'FullB':
			return 1000000000000;
		default:
			var limit = part.a.limit;
			return limit;
	}
};
var $elm$core$Basics$pow = _Basics_pow;
var $author$project$AB$Scrolled = {$: 'Scrolled'};
var $elm$browser$Browser$Dom$getViewport = _Browser_withWindow(_Browser_getViewport);
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$browser$Browser$Dom$setViewport = _Browser_setViewport;
var $author$project$AB$scrollToBottom = function (model) {
	return model.scrolling ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : A2(
		$elm$core$Tuple$pair,
		_Utils_update(
			model,
			{scrolling: true}),
		A2(
			$elm$core$Task$perform,
			function (_v0) {
				return $author$project$AB$Scrolled;
			},
			A2(
				$elm$core$Task$andThen,
				function (viewport) {
					return A2($elm$browser$Browser$Dom$setViewport, 0, viewport.scene.height - viewport.viewport.height);
				},
				$elm$browser$Browser$Dom$getViewport)));
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $author$project$AB$MoveDown = {$: 'MoveDown'};
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {index: index, match: match, number: number, submatches: submatches};
	});
var $elm$regex$Regex$findAtMost = _Regex_findAtMost;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{caseInsensitive: false, multiline: false},
		string);
};
var $elm$regex$Regex$never = _Regex_never;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$AB$repeatRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('((?:,\\d+){10,})\\1\\b'));
var $author$project$AB$findRepeat = F2(
	function (occupied, counts) {
		var string = A2(
			$elm$core$String$join,
			',',
			A2(
				$elm$core$List$map,
				$elm$core$String$fromInt,
				$elm$core$Array$toList(occupied)));
		var _v0 = A3($elm$regex$Regex$findAtMost, 1, $author$project$AB$repeatRegex, string);
		if (_v0.b && (!_v0.b.b)) {
			var match = _v0.a;
			var itemsInLoopRaw = $elm$core$List$length(
				A2($elm$core$String$split, ',', match.match));
			var itemsInLoop = ((itemsInLoopRaw - 1) / 2) | 0;
			var itemsBefore = $elm$core$List$length(
				A2(
					$elm$core$String$split,
					',',
					A2($elm$core$String$left, match.index, string)));
			var rocksBefore = A2(
				$elm$core$Maybe$withDefault,
				0,
				A2($elm$core$Dict$get, itemsBefore - 1, counts));
			var rocksInLoop = (-rocksBefore) + A2(
				$elm$core$Maybe$withDefault,
				0,
				A2($elm$core$Dict$get, (itemsBefore + itemsInLoop) - 1, counts));
			return $elm$core$Maybe$Just(
				{height: itemsInLoop, rocksBefore: rocksBefore, rocksInLoop: rocksInLoop, y: (itemsBefore - 1) + itemsInLoop});
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $author$project$AB$findAndUpdateRepeat = function (model) {
	var _v0 = model.repeat;
	if (_v0.$ === 'Just') {
		return model;
	} else {
		if (!A2(
			$elm$core$Basics$modBy,
			$elm$core$Array$length(model.gas),
			model.rockCounter)) {
			var _v1 = A2($author$project$AB$findRepeat, model.occupied, model.counts);
			if (_v1.$ === 'Just') {
				var repeat = _v1.a;
				var repeatsToSkip = $elm$core$Basics$floor(
					($author$project$AB$partToLimit(model.part) - model.rockCounter) / repeat.rocksInLoop);
				var rocksToSkip = repeatsToSkip * repeat.rocksInLoop;
				var moduloAdjustment = -A2($elm$core$Basics$modBy, 5, rocksToSkip);
				return _Utils_update(
					model,
					{
						repeat: $elm$core$Maybe$Just(
							{moduloAdjustment: moduloAdjustment, repeat: repeat, repeatsToSkip: repeatsToSkip}),
						rockCounter: model.rockCounter + rocksToSkip
					});
			} else {
				return model;
			}
		} else {
			return model;
		}
	}
};
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $author$project$AB$getModuloAdjustment = function (model) {
	var _v0 = model.repeat;
	if (_v0.$ === 'Just') {
		var moduloAdjustment = _v0.a.moduloAdjustment;
		return moduloAdjustment;
	} else {
		return 0;
	}
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$AB$getStoppedY = A2(
	$elm$core$Basics$composeR,
	$elm$core$List$map(
		function (_v0) {
			var y = _v0.y;
			return y;
		}),
	A2(
		$elm$core$Basics$composeR,
		$elm$core$List$maximum,
		$elm$core$Maybe$withDefault(0)));
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (_v0.$ === 'SubTree') {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $author$project$AB$shift = F2(
	function (width, x) {
		return $elm$core$Bitwise$shiftLeftBy(($author$project$AB$chamberWidth - width) - x);
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $author$project$AB$occupy = F3(
	function (occupied, counts, _v0) {
		var x = _v0.x;
		var y = _v0.y;
		var rock = _v0.rock;
		var start = (y - rock.height) + 2;
		var newOccupied = A3(
			$elm$core$List$foldl,
			F2(
				function (_v2, nextOccupied) {
					var nextY = _v2.a;
					var bits = _v2.b;
					var newBits = A3($author$project$AB$shift, rock.width, x, bits) | A2(
						$elm$core$Maybe$withDefault,
						0,
						A2($elm$core$Array$get, nextY, nextOccupied));
					return (_Utils_cmp(
						nextY,
						$elm$core$Array$length(nextOccupied)) > -1) ? A2($elm$core$Array$push, newBits, nextOccupied) : A3($elm$core$Array$set, nextY, newBits, nextOccupied);
				}),
			occupied,
			A2(
				$elm$core$List$indexedMap,
				F2(
					function (index, bits) {
						return _Utils_Tuple2(start + index, bits);
					}),
				rock.bits));
		var newCounts = A3(
			$elm$core$List$foldl,
			F2(
				function (i, acc) {
					return A3(
						$elm$core$Dict$update,
						i,
						function (maybeCount) {
							if (maybeCount.$ === 'Just') {
								var count = maybeCount.a;
								return $elm$core$Maybe$Just(count + 1);
							} else {
								return (_Utils_eq(i, start) ? $elm$core$Maybe$map(
									$elm$core$Basics$add(1)) : $elm$core$Basics$identity)(
									A2($elm$core$Dict$get, i - 1, acc));
							}
						},
						acc);
				}),
			counts,
			A2(
				$elm$core$List$range,
				start,
				$elm$core$Array$length(newOccupied) - 1));
		return _Utils_Tuple2(newOccupied, newCounts);
	});
var $author$project$AB$I = {$: 'I'};
var $author$project$AB$J = {$: 'J'};
var $author$project$AB$Minus = {$: 'Minus'};
var $author$project$AB$Plus = {$: 'Plus'};
var $author$project$AB$Square = {$: 'Square'};
var $author$project$AB$intToVariant = function (i) {
	var _v0 = A2($elm$core$Basics$modBy, 5, i);
	switch (_v0) {
		case 0:
			return $author$project$AB$Minus;
		case 1:
			return $author$project$AB$Plus;
		case 2:
			return $author$project$AB$J;
		case 3:
			return $author$project$AB$I;
		default:
			return $author$project$AB$Square;
	}
};
var $author$project$AB$variantToReversedBits = function (variant) {
	switch (variant.$) {
		case 'Minus':
			return _Utils_Tuple2(
				_List_fromArray(
					[15]),
				4);
		case 'Plus':
			return _Utils_Tuple2(
				_List_fromArray(
					[2, 7, 2]),
				3);
		case 'J':
			return _Utils_Tuple2(
				_List_fromArray(
					[7, 1, 1]),
				3);
		case 'I':
			return _Utils_Tuple2(
				_List_fromArray(
					[1, 1, 1, 1]),
				1);
		default:
			return _Utils_Tuple2(
				_List_fromArray(
					[3, 3]),
				2);
	}
};
var $author$project$AB$oneBasedIntToRock = F2(
	function (adjustment, i) {
		var variant = $author$project$AB$intToVariant((i - 1) + adjustment);
		var _v0 = $author$project$AB$variantToReversedBits(variant);
		var bits = _v0.a;
		var width = _v0.b;
		return {
			bits: bits,
			height: $elm$core$List$length(bits),
			variant: variant,
			width: width
		};
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.tail)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.tail, tail);
		return (notAppended < 0) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: $elm$core$Elm$JsArray$empty
		} : {nodeList: builder.nodeList, nodeListSize: builder.nodeListSize, tail: appended});
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (node.$ === 'SubTree') {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						nodeList: _List_Nil,
						nodeListSize: 0,
						tail: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (_v0.$ === 'SubTree') {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (_v0.$ === 'SubTree') {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $author$project$AB$overlaps = F2(
	function (occupied, _v0) {
		var x = _v0.x;
		var y = _v0.y;
		var rock = _v0.rock;
		var occupiedSlice = A3($elm$core$Array$slice, (y - rock.height) + 2, y + 2, occupied);
		return A2(
			$elm$core$List$any,
			$elm$core$Basics$neq(0),
			A3(
				$elm$core$List$map2,
				A2(
					$elm$core$Basics$composeR,
					A2($author$project$AB$shift, rock.width, x),
					$elm$core$Bitwise$and),
				rock.bits,
				$elm$core$Array$toList(occupiedSlice)));
	});
var $author$project$AB$startBottom = 3;
var $author$project$AB$startLeft = 2;
var $author$project$AB$step = function (model) {
	var _v0 = model.current;
	if (_v0.$ === 'Nothing') {
		if (_Utils_cmp(
			model.rockCounter,
			$author$project$AB$partToLimit(model.part)) > -1) {
			return _Utils_update(
				model,
				{playing: false});
		} else {
			var nextRockCounter = model.rockCounter + 1;
			return _Utils_update(
				model,
				{
					current: $elm$core$Maybe$Just(
						{
							rock: A2(
								$author$project$AB$oneBasedIntToRock,
								$author$project$AB$getModuloAdjustment(model),
								nextRockCounter),
							x: $author$project$AB$startLeft,
							y: $author$project$AB$getStoppedY(model.stopped) + $author$project$AB$startBottom
						}),
					rockCounter: nextRockCounter
				});
		}
	} else {
		var current = _v0.a;
		var _v1 = model.movement;
		if (_v1.$ === 'MoveHorizontally') {
			var movedHorizontally = function () {
				var _v2 = A2($elm$core$Array$get, model.gasIndex, model.gas);
				if (_v2.$ === 'Nothing') {
					return current;
				} else {
					var push = _v2.a;
					if (push.$ === 'Left') {
						if (!current.x) {
							return current;
						} else {
							var next = _Utils_update(
								current,
								{x: current.x - 1});
							return A2($author$project$AB$overlaps, model.occupied, next) ? current : next;
						}
					} else {
						if (_Utils_eq(current.x + current.rock.width, $author$project$AB$chamberWidth)) {
							return current;
						} else {
							var next = _Utils_update(
								current,
								{x: current.x + 1});
							return A2($author$project$AB$overlaps, model.occupied, next) ? current : next;
						}
					}
				}
			}();
			return _Utils_update(
				model,
				{
					current: $elm$core$Maybe$Just(movedHorizontally),
					gasIndex: A2(
						$elm$core$Basics$modBy,
						$elm$core$Array$length(model.gas),
						model.gasIndex + 1),
					movement: $author$project$AB$MoveDown
				});
		} else {
			var movedDown = _Utils_update(
				current,
				{y: current.y - 1});
			if (A2($author$project$AB$overlaps, model.occupied, movedDown)) {
				var _v4 = A3($author$project$AB$occupy, model.occupied, model.counts, current);
				var newOccupied = _v4.a;
				var newCounts = _v4.b;
				if (_Utils_cmp(
					model.rockCounter,
					$author$project$AB$partToLimit(model.part)) > -1) {
					return _Utils_update(
						model,
						{
							counts: newCounts,
							current: $elm$core$Maybe$Nothing,
							occupied: newOccupied,
							playing: false,
							stopped: A2($elm$core$List$cons, current, model.stopped)
						});
				} else {
					var nextRockCounter = model.rockCounter + 1;
					var nextRock = A2(
						$author$project$AB$oneBasedIntToRock,
						$author$project$AB$getModuloAdjustment(model),
						nextRockCounter);
					var newStopped = A2($elm$core$List$cons, current, model.stopped);
					return $author$project$AB$findAndUpdateRepeat(
						_Utils_update(
							model,
							{
								counts: newCounts,
								current: $elm$core$Maybe$Just(
									{
										rock: nextRock,
										x: $author$project$AB$startLeft,
										y: ($author$project$AB$getStoppedY(newStopped) + $author$project$AB$startBottom) + nextRock.height
									}),
								movement: $author$project$AB$MoveHorizontally,
								occupied: newOccupied,
								rockCounter: nextRockCounter,
								stopped: newStopped
							}));
				}
			} else {
				return _Utils_update(
					model,
					{
						current: $elm$core$Maybe$Just(movedDown),
						movement: $author$project$AB$MoveHorizontally
					});
			}
		}
	}
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $elm$virtual_dom$VirtualDom$keyedNodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_keyedNodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $elm$svg$Svg$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$Attributes$style = _VirtualDom_attribute('style');
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $author$project$AB$MoveAbsolute = F2(
	function (a, b) {
		return {$: 'MoveAbsolute', a: a, b: b};
	});
var $author$project$AB$commandsToDString = function (commands) {
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$map,
			function (command) {
				switch (command.$) {
					case 'Move':
						var x = command.a;
						var y = command.b;
						return 'm ' + ($elm$core$String$fromInt(x) + (' ' + $elm$core$String$fromInt(y)));
					case 'MoveAbsolute':
						var x = command.a;
						var y = command.b;
						return 'M ' + ($elm$core$String$fromInt(x) + (' ' + $elm$core$String$fromInt(y)));
					case 'Horizontal':
						var x = command.a;
						return 'h ' + $elm$core$String$fromInt(x);
					default:
						var y = command.a;
						return 'v ' + $elm$core$String$fromInt(y);
				}
			},
			commands));
};
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $author$project$AB$variantToColor = function (variant) {
	switch (variant.$) {
		case 'Minus':
			return '#8dd3c7';
		case 'Plus':
			return '#ffffb3';
		case 'J':
			return '#bebada';
		case 'I':
			return '#fb8072';
		default:
			return '#80b1d3';
	}
};
var $author$project$AB$Horizontal = function (a) {
	return {$: 'Horizontal', a: a};
};
var $author$project$AB$Move = F2(
	function (a, b) {
		return {$: 'Move', a: a, b: b};
	});
var $author$project$AB$Vertical = function (a) {
	return {$: 'Vertical', a: a};
};
var $author$project$AB$variantToPathCommands = function (variant) {
	switch (variant.$) {
		case 'Minus':
			return _List_fromArray(
				[
					$author$project$AB$Horizontal(4),
					$author$project$AB$Vertical(1),
					$author$project$AB$Horizontal(-4),
					$author$project$AB$Vertical(-1)
				]);
		case 'Plus':
			return _List_fromArray(
				[
					A2($author$project$AB$Move, 1, 0),
					$author$project$AB$Horizontal(1),
					$author$project$AB$Vertical(1),
					$author$project$AB$Horizontal(1),
					$author$project$AB$Vertical(1),
					$author$project$AB$Horizontal(-1),
					$author$project$AB$Vertical(1),
					$author$project$AB$Horizontal(-1),
					$author$project$AB$Vertical(-1),
					$author$project$AB$Horizontal(-1),
					$author$project$AB$Vertical(-1),
					$author$project$AB$Horizontal(1),
					$author$project$AB$Vertical(-1)
				]);
		case 'J':
			return _List_fromArray(
				[
					A2($author$project$AB$Move, 2, 0),
					$author$project$AB$Horizontal(1),
					$author$project$AB$Vertical(3),
					$author$project$AB$Horizontal(-3),
					$author$project$AB$Vertical(-1),
					$author$project$AB$Horizontal(2),
					$author$project$AB$Vertical(-2)
				]);
		case 'I':
			return _List_fromArray(
				[
					$author$project$AB$Horizontal(1),
					$author$project$AB$Vertical(4),
					$author$project$AB$Horizontal(-1),
					$author$project$AB$Vertical(-4)
				]);
		default:
			return _List_fromArray(
				[
					$author$project$AB$Horizontal(2),
					$author$project$AB$Vertical(2),
					$author$project$AB$Horizontal(-2),
					$author$project$AB$Vertical(-2)
				]);
	}
};
var $author$project$AB$viewRock = F4(
	function (x, y, attributes, rock) {
		return A2(
			$elm$svg$Svg$path,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d(
						$author$project$AB$commandsToDString(
							A2(
								$elm$core$List$cons,
								A2($author$project$AB$MoveAbsolute, x, y),
								$author$project$AB$variantToPathCommands(rock.variant)))),
						$elm$svg$Svg$Attributes$fill(
						$author$project$AB$variantToColor(rock.variant))
					]),
				attributes),
			_List_Nil);
	});
var $author$project$AB$viewRemaining = F5(
	function (fps, moduloAdjustment, offset, start, end) {
		return A2(
			$elm$core$Tuple$mapFirst,
			A2(
				$elm$svg$Svg$Keyed$node,
				'g',
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$transform(
						'translate(0 ' + ($elm$core$String$fromInt(-offset) + ')')),
						$elm$svg$Svg$Attributes$style(
						'transition: transform ' + ($elm$core$String$fromFloat(1000 / fps) + 'ms ease'))
					])),
			A3(
				$elm$core$List$foldl,
				F2(
					function (i, _v0) {
						var acc = _v0.a;
						var bottom = _v0.b;
						var rock = A2($author$project$AB$oneBasedIntToRock, moduloAdjustment, i);
						var y = (bottom + rock.height) + $author$project$AB$startBottom;
						return _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									$elm$core$String$fromInt(i),
									A4($author$project$AB$viewRock, $author$project$AB$startLeft, -y, _List_Nil, rock)),
								acc),
							y);
					}),
				_Utils_Tuple2(_List_Nil, 0),
				A2(
					$elm$core$List$range,
					start,
					A2($elm$core$Basics$min, 3000, end))));
	});
var $author$project$AB$initPart = function (model) {
	var _v0 = $author$project$AB$parse(
		$author$project$AB$partToInput(model.part));
	if (_v0.$ === 'Ok') {
		var gas = _v0.a;
		return $author$project$AB$scrollToBottom(
			$author$project$AB$step(
				_Utils_update(
					model,
					{
						chamberHeight: A5(
							$author$project$AB$viewRemaining,
							model.fps,
							0,
							0,
							0,
							$author$project$AB$partToLimit(model.part)).b,
						counts: A2($elm$core$Dict$singleton, 0, 0),
						current: $elm$core$Maybe$Nothing,
						gas: gas,
						gasIndex: 0,
						gasInputError: $elm$core$Maybe$Nothing,
						movement: $author$project$AB$MoveHorizontally,
						occupied: $elm$core$Array$fromList(
							_List_fromArray(
								[
									A2($elm$core$Basics$pow, 2, $author$project$AB$chamberWidth) - 1
								])),
						repeat: $elm$core$Maybe$Nothing,
						rockCounter: 0,
						stopped: _List_Nil
					})));
	} else {
		var errors = _v0.a;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					gasInputError: $elm$core$Maybe$Just(
						A2($elm$core$String$join, '\n', errors))
				}),
			$elm$core$Platform$Cmd$none);
	}
};
var $author$project$AB$init = function (_v0) {
	var fps = 8;
	return $author$project$AB$initPart(
		{
			chamberHeight: 0,
			counts: $elm$core$Dict$empty,
			current: $elm$core$Maybe$Nothing,
			fps: fps,
			fpsInput: $elm$core$String$fromInt(fps),
			gas: $elm$core$Array$empty,
			gasIndex: 0,
			gasInput: '<>',
			gasInputError: $elm$core$Maybe$Nothing,
			limitInput: '2022',
			movement: $author$project$AB$MoveHorizontally,
			occupied: $elm$core$Array$empty,
			part: $author$project$AB$ExampleA,
			playing: false,
			repeat: $elm$core$Maybe$Nothing,
			rockCounter: 0,
			scrolling: false,
			steppingToEnd: false,
			stopped: _List_Nil
		});
};
var $author$project$AB$TimePassed = {$: 'TimePassed'};
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 'Every', a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {processes: processes, taggers: taggers};
	});
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 'Nothing') {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$Name = function (a) {
	return {$: 'Name', a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 'Offset', a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.processes;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(_Utils_Tuple0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.taggers);
		if (_v0.$ === 'Nothing') {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$AB$subscriptions = function (model) {
	return model.playing ? A2(
		$elm$time$Time$every,
		1000 / model.fps,
		$elm$core$Basics$always($author$project$AB$TimePassed)) : $elm$core$Platform$Sub$none;
};
var $author$project$AB$Custom = function (a) {
	return {$: 'Custom', a: a};
};
var $author$project$AB$StepToEndStarted = {$: 'StepToEndStarted'};
var $author$project$AB$fpsMin = 1;
var $author$project$AB$limitMin = 1;
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2(
					$elm$core$Task$onError,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Err),
					A2(
						$elm$core$Task$andThen,
						A2(
							$elm$core$Basics$composeL,
							A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
							$elm$core$Result$Ok),
						task))));
	});
var $author$project$AB$currentSvgId = 'currentSvgId';
var $elm$browser$Browser$Dom$getElement = _Browser_getElement;
var $elm$core$Process$sleep = _Process_sleep;
var $author$project$AB$scroll = function (model) {
	return model.scrolling ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : A2(
		$elm$core$Tuple$pair,
		_Utils_update(
			model,
			{scrolling: true}),
		A2(
			$elm$core$Task$attempt,
			function (_v2) {
				return $author$project$AB$Scrolled;
			},
			A2(
				$elm$core$Task$andThen,
				function (_v0) {
					var element = _v0.element;
					var viewport = _v0.viewport;
					var topDiff = element.y - viewport.y;
					return (topDiff < 0) ? A2(
						$elm$core$Task$andThen,
						function (_v1) {
							return $elm$core$Process$sleep(200);
						},
						A2($elm$browser$Browser$Dom$setViewport, viewport.x, (viewport.y + topDiff) - (viewport.height / 2))) : $elm$core$Task$succeed(_Utils_Tuple0);
				},
				$elm$browser$Browser$Dom$getElement($author$project$AB$currentSvgId))));
};
var $author$project$AB$stepToEnd = function (model) {
	stepToEnd:
	while (true) {
		if (model.playing) {
			var $temp$model = $author$project$AB$step(model);
			model = $temp$model;
			continue stepToEnd;
		} else {
			return model;
		}
	}
};
var $author$project$AB$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'NextStepClicked':
				return $author$project$AB$scroll(
					$author$project$AB$step(model));
			case 'TimePassed':
				var nextModel = $author$project$AB$step(model);
				var finalModel = (_Utils_eq(model.current, nextModel.current) && nextModel.playing) ? $author$project$AB$step(nextModel) : nextModel;
				return $author$project$AB$scroll(finalModel);
			case 'PlayPauseToggled':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{playing: !model.playing}),
					$elm$core$Platform$Cmd$none);
			case 'StepToEndClicked':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{playing: false, steppingToEnd: true}),
					A2(
						$elm$core$Task$perform,
						$elm$core$Basics$always($author$project$AB$StepToEndStarted),
						$elm$core$Process$sleep(50)));
			case 'StepToEndStarted':
				var nextModel = $author$project$AB$stepToEnd(
					_Utils_update(
						model,
						{playing: true}));
				return _Utils_Tuple2(
					_Utils_update(
						nextModel,
						{steppingToEnd: false}),
					$elm$core$Platform$Cmd$none);
			case 'SwitchPartClicked':
				var part = msg.a;
				return $author$project$AB$initPart(
					_Utils_update(
						model,
						{part: part}));
			case 'SwitchToCustomClicked':
				return $author$project$AB$initPart(
					_Utils_update(
						model,
						{
							part: $author$project$AB$Custom(
								{
									input: model.gasInput,
									limit: function () {
										var _v1 = $elm$core$String$toInt(model.limitInput);
										if (_v1.$ === 'Just') {
											var limit = _v1.a;
											return A2($elm$core$Basics$max, $author$project$AB$limitMin, limit);
										} else {
											return 2022;
										}
									}()
								})
						}));
			case 'FpsInputChanged':
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							fps: function () {
								var _v2 = $elm$core$String$toInt(input);
								if (_v2.$ === 'Just') {
									var fps = _v2.a;
									return A2($elm$core$Basics$max, $author$project$AB$fpsMin, fps);
								} else {
									return model.fps;
								}
							}(),
							fpsInput: input
						}),
					$elm$core$Platform$Cmd$none);
			case 'GasInputChanged':
				var input = msg.a;
				var _v3 = model.part;
				if (_v3.$ === 'Custom') {
					var data = _v3.a;
					return $author$project$AB$initPart(
						_Utils_update(
							model,
							{
								gasInput: input,
								part: $author$project$AB$Custom(
									_Utils_update(
										data,
										{input: input}))
							}));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'LimitInputChanged':
				var input = msg.a;
				var _v4 = model.part;
				if (_v4.$ === 'Custom') {
					var data = _v4.a;
					return $author$project$AB$initPart(
						_Utils_update(
							model,
							{
								limitInput: input,
								part: $author$project$AB$Custom(
									_Utils_update(
										data,
										{
											limit: function () {
												var _v5 = $elm$core$String$toInt(input);
												if (_v5.$ === 'Just') {
													var limit = _v5.a;
													return A2($elm$core$Basics$max, $author$project$AB$limitMin, limit);
												} else {
													return data.limit;
												}
											}()
										}))
							}));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			default:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{scrolling: false}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $elm$html$Html$div = _VirtualDom_node('div');
var $author$project$AB$ExampleB = {$: 'ExampleB'};
var $author$project$AB$FpsInputChanged = function (a) {
	return {$: 'FpsInputChanged', a: a};
};
var $author$project$AB$FullA = {$: 'FullA'};
var $author$project$AB$FullB = {$: 'FullB'};
var $author$project$AB$GasInputChanged = function (a) {
	return {$: 'GasInputChanged', a: a};
};
var $author$project$AB$LimitInputChanged = function (a) {
	return {$: 'LimitInputChanged', a: a};
};
var $author$project$AB$NextStepClicked = {$: 'NextStepClicked'};
var $author$project$AB$PlayPauseToggled = {$: 'PlayPauseToggled'};
var $author$project$AB$StepToEndClicked = {$: 'StepToEndClicked'};
var $author$project$AB$SwitchPartClicked = function (a) {
	return {$: 'SwitchPartClicked', a: a};
};
var $author$project$AB$SwitchToCustomClicked = {$: 'SwitchToCustomClicked'};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$html$Html$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetChecked));
};
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$pre = _VirtualDom_node('pre');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$AB$viewControls = F2(
	function (stoppedY, model) {
		var repeatHeight = function () {
			var _v8 = model.repeat;
			if (_v8.$ === 'Just') {
				var repeat = _v8.a.repeat;
				var repeatsToSkip = _v8.a.repeatsToSkip;
				return repeat.height * repeatsToSkip;
			} else {
				return 0;
			}
		}();
		var height = (stoppedY + ((!stoppedY) ? 0 : 1)) + repeatHeight;
		var done = _Utils_cmp(
			model.rockCounter,
			$author$project$AB$partToLimit(model.part)) > -1;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('controls-wrapper')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('controls')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick($author$project$AB$PlayPauseToggled),
									$elm$html$Html$Attributes$disabled(done)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									model.playing ? '⏸' : '▶️')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick($author$project$AB$NextStepClicked),
									$elm$html$Html$Attributes$disabled(done)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('⏩')
								])),
							model.steppingToEnd ? A2(
							$elm$html$Html$button,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('⏳')
								])) : A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick($author$project$AB$StepToEndClicked),
									$elm$html$Html$Attributes$disabled(done)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('⏭')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$AB$SwitchPartClicked(model.part))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('↩️')
								])),
							A2(
							$elm$html$Html$label,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('FPS: '),
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('number'),
											$elm$html$Html$Attributes$min(
											$elm$core$String$fromInt($author$project$AB$fpsMin)),
											$elm$html$Html$Attributes$value(model.fpsInput),
											$elm$html$Html$Events$onInput($author$project$AB$FpsInputChanged),
											A2($elm$html$Html$Attributes$style, 'width', '4em')
										]),
									_List_Nil)
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Height: ' + $elm$core$String$fromInt(height))
						])),
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Next rock: ' + $elm$core$String$fromInt(model.rockCounter))
						])),
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Next gas: ' + function () {
								var _v0 = A2($elm$core$Array$get, model.gasIndex, model.gas);
								if (_v0.$ === 'Nothing') {
									return '(none)';
								} else {
									if (_v0.a.$ === 'Left') {
										var _v1 = _v0.a;
										return '<';
									} else {
										var _v2 = _v0.a;
										return '>';
									}
								}
							}())
						])),
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Next move: ' + function () {
								var _v3 = model.movement;
								if (_v3.$ === 'MoveHorizontally') {
									return '↔️';
								} else {
									return '⬇️';
								}
							}())
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('vertical')
						]),
					_Utils_ap(
						A2(
							$elm$core$List$map,
							function (_v4) {
								var part = _v4.a;
								var label = _v4.b;
								return A2(
									$elm$html$Html$label,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$input,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$type_('radio'),
													$elm$html$Html$Attributes$name('part'),
													$elm$html$Html$Events$onCheck(
													$elm$core$Basics$always(
														$author$project$AB$SwitchPartClicked(part))),
													$elm$html$Html$Attributes$checked(
													_Utils_eq(model.part, part))
												]),
											_List_Nil),
											$elm$html$Html$text(label)
										]));
							},
							_List_fromArray(
								[
									_Utils_Tuple2($author$project$AB$ExampleA, 'Example Part 1'),
									_Utils_Tuple2($author$project$AB$ExampleB, 'Example Part 2'),
									_Utils_Tuple2($author$project$AB$FullA, 'Full Part 1'),
									_Utils_Tuple2($author$project$AB$FullB, 'Full Part 2')
								])),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('radio'),
												$elm$html$Html$Attributes$name('part'),
												$elm$html$Html$Events$onCheck(
												$elm$core$Basics$always($author$project$AB$SwitchToCustomClicked)),
												$elm$html$Html$Attributes$checked(
												function () {
													var _v5 = model.part;
													if (_v5.$ === 'Custom') {
														return true;
													} else {
														return false;
													}
												}())
											]),
										_List_Nil),
										$elm$html$Html$text('Custom')
									]))
							]))),
					function () {
					var _v6 = model.part;
					if (_v6.$ === 'Custom') {
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('vertical')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$label,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Limit: '),
											A2(
											$elm$html$Html$input,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$type_('number'),
													$elm$html$Html$Attributes$min(
													$elm$core$String$fromInt($author$project$AB$limitMin)),
													$elm$html$Html$Attributes$value(model.limitInput),
													$elm$html$Html$Events$onInput($author$project$AB$LimitInputChanged),
													A2($elm$html$Html$Attributes$style, 'width', '4em')
												]),
											_List_Nil)
										])),
									A2(
									$elm$html$Html$textarea,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$placeholder('Paste input here'),
											A2($elm$html$Html$Attributes$style, 'width', '11em'),
											$elm$html$Html$Events$onInput($author$project$AB$GasInputChanged),
											$elm$html$Html$Attributes$value(model.gasInput)
										]),
									_List_Nil),
									function () {
									var _v7 = model.gasInputError;
									if (_v7.$ === 'Just') {
										var error = _v7.a;
										return A2(
											$elm$html$Html$pre,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(error)
												]));
									} else {
										return $elm$html$Html$text('');
									}
								}()
								]));
					} else {
						return $elm$html$Html$text('');
					}
				}()
				]));
	});
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$AB$viewChamber = function (chamberHeight) {
	return A2(
		$elm$svg$Svg$rect,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$x('-0.5'),
				$elm$svg$Svg$Attributes$y(
				$elm$core$String$fromFloat(-(chamberHeight + 0.5))),
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromInt($author$project$AB$chamberWidth + 1)),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromInt(chamberHeight + 2)),
				$elm$svg$Svg$Attributes$fill('none'),
				$elm$svg$Svg$Attributes$stroke('white'),
				$elm$svg$Svg$Attributes$strokeWidth('1')
			]),
		_List_Nil);
};
var $elm$svg$Svg$Attributes$fontSize = _VirtualDom_attribute('font-size');
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $author$project$AB$viewRepeat = function (_v0) {
	var repeat = _v0.repeat;
	var repeatsToSkip = _v0.repeatsToSkip;
	return A2(
		$elm$svg$Svg$g,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x('0'),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromInt(-(repeat.y - 1))),
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromInt($author$project$AB$chamberWidth)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromInt(repeat.height)),
						$elm$svg$Svg$Attributes$fill('none'),
						$elm$svg$Svg$Attributes$stroke('magenta'),
						$elm$svg$Svg$Attributes$strokeWidth('0.25')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat($author$project$AB$chamberWidth + 1.5)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromInt(-(repeat.y - 2))),
						$elm$svg$Svg$Attributes$fill('magenta'),
						$elm$svg$Svg$Attributes$fontSize('1')
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text(
						'* ' + $elm$core$String$fromInt(repeatsToSkip))
					]))
			]));
};
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $author$project$AB$viewStopped = function (stoppedRocks) {
	return A3(
		$elm$svg$Svg$Keyed$node,
		'g',
		_List_Nil,
		A2(
			$elm$core$List$map,
			function (_v0) {
				var x = _v0.x;
				var y = _v0.y;
				var rock = _v0.rock;
				return _Utils_Tuple2(
					$elm$core$String$fromInt(x) + (',' + $elm$core$String$fromInt(y)),
					A4(
						$author$project$AB$viewRock,
						x,
						-y,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$class('stopped')
							]),
						rock));
			},
			stoppedRocks));
};
var $author$project$AB$viewSvg = F2(
	function (stoppedY, model) {
		var padding = 2;
		var _v0 = function () {
			var _v1 = model.current;
			if (_v1.$ === 'Just') {
				var x = _v1.a.x;
				var y = _v1.a.y;
				var rock = _v1.a.rock;
				return _Utils_Tuple2(
					A2(
						$elm$svg$Svg$g,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$transform(
								'translate( ' + ($elm$core$String$fromInt(x) + (' ' + ($elm$core$String$fromInt(-y) + ')')))),
								$elm$svg$Svg$Attributes$style(
								'transition: transform ' + ($elm$core$String$fromFloat(1000 / model.fps) + 'ms ease')),
								$elm$svg$Svg$Attributes$id($author$project$AB$currentSvgId)
							]),
						_List_fromArray(
							[
								A4($author$project$AB$viewRock, 0, 0, _List_Nil, rock)
							])),
					y);
			} else {
				return _Utils_Tuple2(
					$elm$svg$Svg$text(''),
					0);
			}
		}();
		var currentSvg = _v0.a;
		var currentY = _v0.b;
		var offsetY = A2($elm$core$Basics$max, stoppedY, currentY);
		var _v2 = model;
		var chamberHeight = _v2.chamberHeight;
		var viewBox = $elm$svg$Svg$Attributes$viewBox(
			A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					$elm$core$String$fromInt,
					_List_fromArray(
						[0 - padding, (-chamberHeight) - padding, ($author$project$AB$chamberWidth + 1) + (2 * padding), chamberHeight + (2 * padding)]))));
		return A3(
			$elm$svg$Svg$Keyed$node,
			'svg',
			_List_fromArray(
				[viewBox]),
			_List_fromArray(
				[
					_Utils_Tuple2(
					'viewChamber',
					$author$project$AB$viewChamber(chamberHeight)),
					_Utils_Tuple2(
					'viewStopped',
					$author$project$AB$viewStopped(model.stopped)),
					_Utils_Tuple2(
					'viewRepeat',
					function () {
						var _v3 = model.repeat;
						if (_v3.$ === 'Just') {
							var repeatData = _v3.a;
							return $author$project$AB$viewRepeat(repeatData);
						} else {
							return $elm$svg$Svg$text('');
						}
					}()),
					_Utils_Tuple2(
					'viewRemaining' + $elm$core$String$fromInt(model.rockCounter),
					A5(
						$author$project$AB$viewRemaining,
						model.fps,
						$author$project$AB$getModuloAdjustment(model),
						offsetY,
						model.rockCounter + 1,
						$author$project$AB$partToLimit(model.part)).a),
					_Utils_Tuple2(
					'currentSvg' + $elm$core$String$fromInt(model.rockCounter),
					currentSvg)
				]));
	});
var $author$project$AB$view = function (model) {
	var stoppedY = $author$project$AB$getStoppedY(model.stopped);
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2($author$project$AB$viewSvg, stoppedY, model),
				A2($author$project$AB$viewControls, stoppedY, model)
			]));
};
var $author$project$AB$main = $elm$browser$Browser$element(
	{init: $author$project$AB$init, subscriptions: $author$project$AB$subscriptions, update: $author$project$AB$update, view: $author$project$AB$view});
_Platform_export({'AB':{'init':$author$project$AB$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));