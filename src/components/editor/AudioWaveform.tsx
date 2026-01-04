import PlaybackWaveform from "@/components/editor/audio/PlaybackWaveform";
import RecordingWaveform from "@/components/editor/audio/RecordingWaveform";

type Props = {
  duration: number;
  currentTime: number;
  isPlaying?: boolean;
  isRecording?: boolean;
  seekTo?: (sec: number) => void;
};

export default function AudioWaveform(props: Props) {
  if (props.isRecording) {
    return <RecordingWaveform />;
  }

  return (
    <PlaybackWaveform
      duration={props.duration}
      currentTime={props.currentTime}
      isPlaying={!!props.isPlaying}
      seekTo={props.seekTo}
    />
  );
}
