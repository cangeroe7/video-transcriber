import React from "react";
import { Composition } from "remotion";
import { MainVideo, calculateMetaData } from "./MyVideo";
import { defaultMyVideoProps } from "../types";


export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id={"MyVideo"}
                component={MainVideo}
                durationInFrames={60}
                fps={30}
                width={1280}
                height={720}
                defaultProps={{
                    ...defaultMyVideoProps,
                    setSettings: () => {},
                }}
                calculateMetadata={calculateMetaData}
            />
        </>
    );
};
