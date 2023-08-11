import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_EXTERNALS, DokAction, ScriptProcessor } from 'dok-actions';
import { DokEditor, getObject } from "dok-editor";
import { parse, stringify } from 'yaml';

export const App = () => {
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [language, setLanguage] = useState("yaml");
    const [running, setRunning] = useState(false);
    const outputArea = useRef<HTMLTextAreaElement>(null);
    const [cleanupAction, setCleanupAction] = useState(() => () => {});

    useEffect(() => {
        fetch("code/initial-code.yaml").then(response => response.text()).then(text => {
            setCode(stringify(parse(text)));
        });
    }, []);

    const processor = useRef<ScriptProcessor<DokAction>>();
    const outputter = useMemo(() => {
        let preDate = "";
        return {
            send: (params: any) => {
                setOutput(output => {
                    const dateLine = `------ ${new Date().toLocaleString()} ------\n`;
                    const result = output + (preDate !== dateLine ? dateLine : "") + params + "\n";
                    preDate = dateLine;
                    return result;
                });
            },
        };
    }, [setOutput]);

    useEffect(() => {
        outputter.send("Welcome to NAPL!\n\nNAPL is a new programming environment. Use the editor on the right to input your code.")
    }, [outputter])


    const stop = useCallback(() => {
        cleanupAction();
        setRunning(running => {
            if (running) {
                processor.current?.clear();
                outputter.send("========================================\n");        
            }
            return false;
        });
    }, [outputter, cleanupAction]);

    const execute = useCallback(async () => {
        stop();
        const obj = getObject(code, language);
        processor.current = new ScriptProcessor(obj.scripts, {
            ...DEFAULT_EXTERNALS,
            log: outputter.send,
        });
        const cleanup = await processor.current.runByTags(["main"]);
        setRunning(true);
        outputter.send("========== EXECUTING SCRIPT ============\n");
        setCleanupAction(() => cleanup);
    }, [code, language, outputter, processor, stop]);

    useEffect(() => {
        if (outputArea.current) {
            outputArea.current.scrollTop = outputArea.current.scrollHeight;
        }
    }, [outputArea, output]);

    return <>
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row" }}>
            <div style={{ border: "1px solid black", width: "50%", height: "100%" }}>
                <div style={{ width: "100%" }}>
                    <div style={{ backgroundColor: "#bbffdd", width: "100%" }}>
                        <label htmlFor="log">Output</label>
                    </div>
                    <textarea ref={outputArea} id="log" readOnly style={{ width: "100%", height: 500, borderWidth: 0, color: "snow", backgroundColor: "black", scrollBehavior: "smooth" }} value={output}></textarea>
                    <button onClick={() => setOutput("")} style={{ position: "absolute", bottom: 10, left: 10 }}>clear</button>
                </div>
            </div>
            <div style={{ border: "1px solid black", width: "50%", height: "100%" }}>
                <button onClick={execute} disabled={running}>execute</button><button onClick={stop} disabled={!running}>stop</button>
                <DokEditor code={code} onCodeChange={setCode} language={language} onLanguageChange={setLanguage} />
            </div>
        </div>
    </>;
};