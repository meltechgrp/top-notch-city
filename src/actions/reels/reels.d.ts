interface ReelVideo {
  id: string;
  uri: string;
  title: string;
  description: string;
  interations?: Interaction;
  owner_interaction?: Owner_interaction;
  created_at: string;
  owner?: Owner;
  purpose: PropertyPurpose;
  price: number;
  location: string;
}
interface VideoPlayerProps {
  style?: StyleProp<ViewStyle>;
  rounded?: boolean;
  reel: ReelVideo;
  canPlayVideo?: boolean;
  fullScreen?: boolean;
  shouldPlay?: boolean;
  onPress?: (uri: string) => void;
  inTab?: boolean;
}
type VideoPlayerHandle = {
  play: () => void;
  pause: () => void;
  seekTo?: (sec: number) => void;
  reset: () => void;
};

interface PropertyInteractionBar {
  reel: ReelVideo;
  showChat?: boolean;
  showShare?: boolean;
  showMuted?: boolean;
  setShowBottomSheet: () => void;
}
