import { z } from "zod";
import { Button } from "~/components/ui/remotion-button";
import { InputContainer } from "~/components/ui/container";
import { DownloadButton } from "~/components/ui/download-button";
import { Spacing } from "~/components/ui/spacing";
import { ErrorComp } from "~/components/ui/error";
import { ProgressBar } from "~/components/ui/progress-bar";
import { SubVidProps } from "~/types";
import { useRendering } from "~/helpers/use-rendering";
import { AlignEnd } from "~/components/ui/align-end";

export const RenderControls: React.FC<{
    inputProps: z.infer<typeof SubVidProps>;
}> = ({ inputProps }) => {
    const { renderMedia, state, undo } = useRendering("MyVideo", inputProps);

    return (
        <InputContainer>
            {state.status === "init" ||
                state.status === "invoking" ||
                state.status === "error" ? (
                <>
                    <AlignEnd>
                        <Button
                            disabled={state.status === "invoking"}
                            loading={state.status === "invoking"}
                            onClick={renderMedia}
                        >
                            Render video
                        </Button>
                    </AlignEnd>
                    {state.status === "error" ? (
                        <ErrorComp message={state.error.message}></ErrorComp>
                    ) : null}
                </>
            ) : null}
            {state.status === "rendering" || state.status === "done" ? (
                <>
                    <ProgressBar
                        progress={state.status === "rendering" ? state.progress : 1}
                    />
                    <Spacing></Spacing>
                    <AlignEnd>
                        <DownloadButton undo={undo} state={state}></DownloadButton>
                    </AlignEnd>
                </>
            ) : null}
        </InputContainer>
    );
};
