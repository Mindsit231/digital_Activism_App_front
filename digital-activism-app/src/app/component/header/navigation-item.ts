import {
  faArrowRightToBracket,
  faDiagramProject,
  faHome,
  faLocationDot,
  faMessage, faQuestion,
  faSearch, faSignsPost
} from "@fortawesome/free-solid-svg-icons";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

class NavigationItem {
  constructor(private name: string, private link: string, private faIcon: IconDefinition, private isLoggedIn: boolean = false) {
  }

  getName(): string {
    return this.name;
  }

  getLink(): string {
    return this.link;
  }

  getIcon(): IconDefinition {
    return this.faIcon;
  }

  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }
}

export const homeNavigationItem = new NavigationItem("Home", "/home", faHome);
export const messagesNavigationItem = new NavigationItem("Messages", "/messages", faMessage, true);
export const myPostsNavigationItem = new NavigationItem("My Posts", "/my-posts", faSignsPost, true);

export const navigationItems = [
  homeNavigationItem,
  messagesNavigationItem,
  myPostsNavigationItem,
];
