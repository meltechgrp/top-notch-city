interface Reel {
  id: string;
  video: string;
  photos: Media[];
  title: string;
  description: string;
  interations: Interaction;
  owner_interaction: Owner_interaction;
  created_at: string;
  owner?: Owner;
  purpose: PropertyPurpose;
  price: number;
  location: string;
  is_following: boolean;
}
interface VideoPlayerProps {
  style?: StyleProp<ViewStyle>;
  rounded?: boolean;
  reel: Reel;
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
  status: VideoPlayerStatus;
};

interface ReelInteractionBar {
  reel: Reel;
  showChat?: boolean;
  showShare?: boolean;
  showMuted?: boolean;
  setShowBottomSheet: () => void;
}

interface ReelPhotoViewerProps {
  rounded?: boolean;
  onPress?: (uri: string) => void;
  reel: Reel;
  fullScreen?: boolean;
  inTab?: boolean;
  width: number;
  height: number;
}
