/* Io Community Manager - Web Application for Managing Open Projects
 *                        and Communities
 * Copyright (C) 2005 Kenton Varda
 * <http://www.fateofio.org>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version
 * 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU Library General Public
 * License along with this program; if not, write to the Free
 * Software Foundation, Inc., 59 Temple Place - Suite 330, Boston,
 * MA 02111-1307, USA
 * ====================================================================
 * Revision History:
 * 2005/02/09 (KV)
 *  + First Version
 * ==================================================================== */

var iocmOriginTime;

function initIocm(originTime)
{
   iocmOriginTime = originTime;
}

function twoDigits(i)
{
   if(i < 10)
      return "0" + i;
   else
      return "" + i;
}

function writeDate(time)
{
   date = new Date((iocmOriginTime + time) * 1000);
   document.write(date.getFullYear()
          + "/" + twoDigits(date.getMonth()+1)
          + "/" + twoDigits(date.getDate())
          + " " + twoDigits(date.getHours())
          + ":" + twoDigits(date.getMinutes())
          + ":" + twoDigits(date.getSeconds()));
}

function getChecks(prefix)
{
   var inputs = document.getElementsByTagName("input");
   var results = "";

   for(var i = 0; i < inputs.length; i++)
   {
      if(inputs[i].type == "checkbox"
      && inputs[i].name.substring(0,9) == prefix
      && inputs[i].checked)
      {
         if(results.length > 0)
            results += ",";
         results += inputs[i].name.substring(9);
      }
   }

   return results;
}

function getCoords(element)
{
   var x = 0, y = 0;
   while(element)
   {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
   }

   var result = new Object;
   result.x = x;
   result.y = y;
   return result;
}

function updatePreviewColor(event, element, wantReset, wantUpdate)
{
   updatePreviewColor2(event, element, wantReset, wantUpdate, 150, 220)
}

function updatePreviewColor2(event, element, wantReset, wantUpdate, borderLuminance, backgroundLuminance)
{
   var hue, saturation;

   if(wantReset)
   {
      hue = parseInt(element.form.hue.value);
      saturation = parseInt(element.form.saturation.value);
   }
   else
   {
      /* Here it is, folks.  An example of a way in which Mozilla is
       * fucking stupid while IE is smart. */
      if(typeof(event.offsetX) == 'undefined')
      {
         /* Mozilla:  Event gives us coordinates relative to the page,
          * not the image.  Meanwhile, the only way to find the location
          * of the image relative to the page is to traverse up through
          * the images parents and acculumate the position offsets.
          * This is absolutely ridiculous, and IMHO is stupider than
          * any of the stupid things IE does.  I don't care what the
          * standards say.  If this is "standard" then "standard" is
          * "retarded". */
         var coords = getCoords(element);
         hue = event.pageX - coords.x;
         saturation = 240 - (event.pageY - coords.y);
      }
      else
      {
         //IE:  The event already contains the coordinates.
         hue = event.offsetX;
         saturation = 240 - event.offsetY;
      }
   }

   if(isNaN(hue) || hue < 0)
      hue = 0;
   else if(hue > 239)
      hue = 239;
   hue = Math.floor(hue);
   if(isNaN(saturation) || saturation < 0)
      saturation = 0;
   else if(saturation > 239)
      saturation = 239;
   saturation = Math.floor(saturation);

   border = hsb2color(hue, saturation * 0.5, borderLuminance);
   background = hsb2color(hue, saturation, backgroundLuminance);

   previewBox = document.getElementById("color-preview");
   previewBox.style.color = border;
   previewBox.style.borderColor = border;
   previewBox.style.backgroundColor = background;

   details = previewBox.getElementsByTagName("div")[0];
   details.style.color = border;
   details.style.borderColor = border;
   details.style.backgroundColor = background;

   if(wantUpdate)
   {
      //don't set value if responding to key event and field is blank.
      if(!wantReset || element.form.hue.value.length != 0)
         element.form.hue.value = hue.toString();
      if(!wantReset || element.form.saturation.value.length != 0)
         element.form.saturation.value = saturation.toString();
   }
}

function hsb2color(hue, saturation, luminance)
{
   var s = saturation / 240;
   var l = luminance / 240;

   var temp2;
   if(l < 0.5)
      temp2 = l*(1+s)
   else
      temp2 = l+s - l*s;
   var temp1 = 2*l - temp2;

   var rTemp3 = (hue + 80) % 240;
   var gTemp3 = hue;
   var bTemp3 = (hue + 160) % 240;

   var r, g, b;

   if(rTemp3 < 40)
      r = temp1 + (temp2-temp1)*(rTemp3/40);
   else if(rTemp3 < 120)
      r = temp2;
   else if(rTemp3 < 160)
      r = temp1 + (temp2-temp1)*(160-rTemp3)/40;
   else
      r = temp1;

   if(gTemp3 < 40)
      g = temp1 + (temp2-temp1)*(gTemp3/40);
   else if(gTemp3 < 120)
      g = temp2;
   else if(gTemp3 < 160)
      g = temp1 + (temp2-temp1)*(160-gTemp3)/40;
   else
      g = temp1;

   if(bTemp3 < 40)
      b = temp1 + (temp2-temp1)*(bTemp3/40);
   else if(bTemp3 < 120)
      b = temp2;
   else if(bTemp3 < 160)
      b = temp1 + (temp2-temp1)*(160-bTemp3)/40;
   else
      b = temp1;

   r = Math.floor(r*256);
   g = Math.floor(g*256);
   b = Math.floor(b*256);

   if(r > 255) r = 255;
   if(g > 255) g = 255;
   if(b > 255) b = 255;

   red   = r.toString(16);
   green = g.toString(16);
   blue  = b.toString(16);

   if(red.length   == 1) red   = "0" + red  ;
   if(green.length == 1) green = "0" + green;
   if(blue.length  == 1) blue  = "0" + blue ;

   return "#"+red+green+blue;
}




var request;

function loadXMLDoc(url)
{
   if(window.XMLHttpRequest)
   {
      request = new XMLHttpRequest();
      request.onreadystatechange = readyStateChanged;
      request.open("GET", url, true);
      request.send(null);
   }
   else if(window.ActiveXObject)
   {
      request = new ActiveXObject("Microsoft.XMLHTTP");
      if(request)
      {
         request.onreadystatechange = readyStateChanged;
         request.open("GET", url, true);
         request.send();
      }
   }
}

function readyStateChanged()
{
   if(request && request.readyState == 4 && request.status == 200)
   {
      progress = document.getElementById("uploadProgress");

      if(request.responseText == "")
         progress.innerHTML = "Progress: Error";
      else
      {
         progress.innerHTML = "Progress: " + composeSize(parseInt(request.responseText));
         setTimeout("updateProgress()", 1000);
      }

      request = null;  //don't accept further events from this request!
   }
}

function composeSize(i)
{
   if(i < 1024)
      return i.toString() + " bytes";
   else if(i < 1048576)
      return (i / 1024).toPrecision(3) + " KiB";
   else if(i < 1073741824)
      return (i / 1048576).toPrecision(3) + " MiB";
   else
      return (i / 1073741824).toPrecision(3) + " GiB";
}

function updateProgress()
{
   loadXMLDoc("?showUploadProgress");
}

function doFileSubmit()
{
   if(document.getElementById("uploadField").value != "")
      setTimeout("updateProgress()", 1000);
}





//chat ===============================================================
var chatApplet;
var chatLog;
var chatUsers;
var chatInited;
var chatTimestamp = "";
var chatAvatarsUrl;
var chatIocmUrl;
var chatUsername;
var chatNameLuminance;
var chatBorderLuminance;
var chatBackgroundLuminance;

function chatInit(iocmUrl, avatarsUrl, username)
{
   chatInit2(iocmUrl, avatarsUrl, username, 120, 150, 220);
}

function chatInit2(iocmUrl, avatarsUrl, username, nameLuminance, borderLuminance, backgroundLuminance)
{
   if(chatInited)
      return;
   chatAvatarsUrl = avatarsUrl;
   chatIocmUrl = iocmUrl;
   chatUsername = username;
   chatNameLuminance = nameLuminance;
   chatBorderLuminance = borderLuminance;
   chatBackgroundLuminance = backgroundLuminance;
   chatInited = true;

   chatLog   = document.getElementById("chat-log");
   chatUsers = document.getElementById("chat-users");

   chatApplet = document.applets[0];
   var needPoll = chatApplet.connect(document.cookie);

   document.getElementById("chat-active").style.display = "block";
   document.getElementById("chat-warning").style.display = "none";
   chatRestoreBeepControls();

   if(needPoll == "true")
      setTimeout("chatPoll()", 500);  //compensate for poor LiveConnect on OSX.
   else if(needPoll != "false")
      chatError("Error:  Invalid return when invoking Java from JavaScript.  Your browser's LiveConnect support may be lacking.  This chat room probably won't work.");

   setTimeout("chatKeepalive()", 120000);
}

function chatKeepalive()
{
   chatApplet.submit("/noop");
   setTimeout("chatKeepalive()", 120000);
}

function chatPoll()
{
   commands = chatApplet.pollCommands();
   for(var i = 0; i < commands.length; i++)
      chatCommand(commands[i][0], commands[i][1], commands[i][2], commands[i][3]);
   setTimeout("chatPoll()", 500);
}

function chatToogleBeepControls()
{
   var controls = document.getElementById("chat-beep-controls");
   var link = document.getElementById("chat-beep-controls-toggle");
   if(controls.style.display == "block")
   {
      controls.style.display = "none";
      link.innerHTML = "Show chat controls.";
   }
   else
   {
      controls.style.display = "block";
      link.innerHTML = "Hide chat controls.";
   }
}

function chatSaveBeepControls()
{
   cookieValue = "";
   cookieValue += document.getElementById("beep-say").checked?"t":"f";
   cookieValue += document.getElementById("beep-join").checked?"t":"f";
   cookieValue += document.getElementById("beep-leave").checked?"t":"f";
   cookieValue += document.getElementById("beep-away").checked?"t":"f";
   cookieValue += document.getElementById("beep-back").checked?"t":"f";
   cookieValue += document.getElementById("beep-beep").checked?"t":"f";
   cookieValue += document.getElementById("beep-user").checked?"t":"f";
   cookieValue += document.getElementById("show-timestamps").checked?"t":"f";
   cookieValue += document.getElementById("show-status").checked?"t":"f";
   cookieValue += document.getElementById("show-beep").checked?"t":"f";
   cookieValue += document.getElementById("beep-tell").checked?"t":"f";

   document.cookie = "beep-controls=" + cookieValue + ";expires=Fri, 01-Jan-2038 00:00:00 GMT";
}

function chatRestoreBeepControls()
{
   var cookies = document.cookie;
   var start = cookies.indexOf("beep-controls=");
   if(start == -1)
      return;
   start += "beep-controls=".length;
   end = cookies.indexOf(";", start);
   cookie = cookies.substring(start, end);

   document.getElementById("beep-say"  ).checked = (cookie.length >  0 && cookie.charAt(0) == "t");
   document.getElementById("beep-join" ).checked = (cookie.length >  1 && cookie.charAt(1) == "t");
   document.getElementById("beep-leave").checked = (cookie.length >  2 && cookie.charAt(2) == "t");
   document.getElementById("beep-away" ).checked = (cookie.length >  3 && cookie.charAt(3) == "t");
   document.getElementById("beep-back" ).checked = (cookie.length >  4 && cookie.charAt(4) == "t");
   document.getElementById("beep-beep" ).checked = (cookie.length <= 5 || cookie.charAt(5) == "t");
   document.getElementById("beep-user" ).checked = (cookie.length <= 6 || cookie.charAt(6) == "t");
   document.getElementById("show-timestamps").checked = (cookie.length <= 7 || cookie.charAt(7) == "t");
   document.getElementById("show-status"    ).checked = (cookie.length <= 8 || cookie.charAt(8) == "t");
   document.getElementById("show-beep"      ).checked = (cookie.length <= 9 || cookie.charAt(9) == "t");
   document.getElementById("beep-tell"      ).checked = (cookie.length <= 10 || cookie.charAt(10) == "t");
}

function chatWriteTimestamp(time)
{
   date = new Date((iocmOriginTime + time) * 1000);
   document.write("[" + twoDigits(date.getHours())
                + ":" + twoDigits(date.getMinutes())
                + ":" + twoDigits(date.getSeconds()) + "]");
}

function chatCommand(name, parameters, hasTextString, text)
{
   var hasText = hasTextString == "true";

   var time = parameters.getProperty("time");
   if(time && document.getElementById("show-timestamps").checked)
   {
      time = parseFloat(time);
      var origin = new Date(0);
      origin.setUTCFullYear(2005);
      date = new Date(origin.getTime() + time * 1000);
      chatTimestamp = "[" + twoDigits(date.getHours())
                    + ":" + twoDigits(date.getMinutes())
                    + ":" + twoDigits(date.getSeconds()) + "] ";
   }
   else
      chatTimestamp = "";

   //Have to add "" to any string pulled from the parameter list
   //because liveconnect fails to recognize them as Strings,
   //instead wrapping them like any other Object.
   if(name == "say")
   {
      var hue = parameters.getProperty("hue");
      var saturation = parameters.getProperty("saturation");

      var color = null;
      if(hue && saturation)
         color = hsb2color(parseInt(hue), parseInt(saturation), chatNameLuminance);

      chatSay("say", parameters.getProperty("username"), text, color);
      chatBeep("say");
   }
   else if(name == "emote")
   {
      var hue = parameters.getProperty("hue");
      var saturation = parameters.getProperty("saturation");

      var color = null;
      if(hue && saturation)
         color = hsb2color(parseInt(hue), parseInt(saturation), chatNameLuminance);

      chatEmote(parameters.getProperty("username"), text, color);
      chatBeep("say");
   }
   else if(name == "tell")
   {
      var hue = parameters.getProperty("hue");
      var saturation = parameters.getProperty("saturation");

      var color = null;
      if(hue && saturation)
         color = hsb2color(parseInt(hue), parseInt(saturation), chatNameLuminance);

      var receiver = parameters.getProperty("receiver") + "";
      chatSay("tell", parameters.getProperty("username") + " to " + receiver, text, color);

      if(receiver != "" && fixName(receiver) == chatUsername)
         chatBeep("tell");
   }
   else if(name == "rollcall")
   {
      var hue = parameters.getProperty("hue");
      var saturation = parameters.getProperty("saturation");
      var border = null;
      var background = null;
      if(hue && saturation)
      {
         hue = parseInt(hue);
         saturation = parseInt(saturation);
         border = hsb2color(hue, saturation * 0.5, chatBorderLuminance);
         background = hsb2color(hue, saturation, chatBackgroundLuminance);
      }

      chatAddUser(parseInt(parameters.getProperty("id")), parameters.getProperty("username") + "",
                  parseFloat(parameters.getProperty("influence")),
                  parameters.getProperty("avatar"), border, background, hasText, text);
   }
   else if(name == "join")
   {
      var hue = parameters.getProperty("hue");
      var saturation = parameters.getProperty("saturation");
      var border = null;
      var background = null;
      if(hue && saturation)
      {
         hue = parseInt(hue);
         saturation = parseInt(saturation);
         border = hsb2color(hue, saturation * 0.5, chatBorderLuminance);
         background = hsb2color(hue, saturation, chatBackgroundLuminance);
      }

      username = parameters.getProperty("username");
      chatAddUser(parseInt(parameters.getProperty("id")), username + "",
                  parseFloat(parameters.getProperty("influence")),
                  parameters.getProperty("avatar"), border, background, false, null);
      chatLogText("status", username + " joined.");
      chatBeep("join");
   }
   else if(name == "leave")
   {
      chatRemoveUser(parseInt(parameters.getProperty("id")));
      chatLogText("status", parameters.getProperty("username") + " left.");
      chatBeep("leave");
   }
   else if(name == "away")
   {
      var show = document.getElementById("show-status").checked;
      chatSetAway(parseInt(parameters.getProperty("id")), hasText, text);
      if(!hasText)
      {
         if(show)
            chatLogText("status", parameters.getProperty("username") + " returned.");
         chatBeep("back");
      }
      else if(text == "")
      {
         if(show)
            chatLogText("status", parameters.getProperty("username") + " went away.");
         chatBeep("away");
      }
      else
      {
         if(show)
            chatLogText("status", parameters.getProperty("username") + " went away: " + text);
         chatBeep("away");
      }
   }
   else if(name == "beep")
   {
      var show = document.getElementById("show-beep").checked;
      if(hasText)
      {
         if(show)
            chatLogText("beep", parameters.getProperty("username") + " beeped " + text + ".");
         text += "";
         if(text != "" && fixName(text) == chatUsername)
            chatBeep("user");
      }
      else
      {
         if(show)
            chatLogText("beep", parameters.getProperty("username") + " beeped.");
         chatBeep("beep");
      }
   }
   else if(name == "award")
   {
      var amount = parseFloat(parameters.getProperty("amount"));
      var message = parameters.getProperty("username");

      if(amount < 0)
         message += " docked ";
      else
         message += " awarded ";

      message += text + " ";
      if(amount < 0)
         message += (-amount);
      else
         message += amount;

      if(Math.abs(amount) == 1)
         message += " point.";
      else
         message += " points.";

      chatLogText("award", message);
   }
   else if(name == "kick")
      chatLogText("kick", parameters.getProperty("username") + " kicked " + text + ".");
   else if(name == "watcherJoin" || name == "watcherRollcall")
      chatAddWatcher()
   else if(name == "watcherLeave")
      chatRemoveWatcher()
   else if(name == "roll")
   {
      chatLogText("roll", parameters.getProperty("username") + " rolls (1-"
                + parameters.getProperty("max") + "): " + parameters.getProperty("result"));
   }
   else if(name == "error")
      chatError(text);
}

function chatBeep(eventName)
{
   checkbox = document.getElementById("beep-" + eventName);

   if(checkbox && checkbox.checked)
      chatApplet.beep();
}

function chatError(message)
{
   chatLogText("error", message);
}

function chatLogText(className, text)
{
   //add a paragraph containing the text
   var paragraph = document.createElement("p");
   paragraph.className = className;
   paragraph.appendChild(document.createTextNode(chatTimestamp + text));
   chatLogElement(paragraph);
}

function chatSay(className, username, text, color)
{
   //add a paragraph containing the text
   var paragraph = document.createElement("p");
   paragraph.className = className;
   var prefix = document.createElement("b");
   if(color)
      prefix.style.color = color;
   prefix.appendChild(document.createTextNode(chatTimestamp + username + ":"));
   paragraph.appendChild(prefix);
   paragraph.appendChild(document.createTextNode(" "));

   var content = document.createElement("span");
   content.innerHTML = text;
   paragraph.appendChild(content);
   chatLogElement(paragraph);
}

function chatEmote(username, text, color)
{
   //add a paragraph containing the text
   var paragraph = document.createElement("p");
   paragraph.className = "emote";
   if(color)
      paragraph.style.color = color;
   paragraph.appendChild(document.createTextNode(chatTimestamp + username + " " + text));
   chatLogElement(paragraph);
}

function chatAway(username, text)
{
   //add a paragraph containing the text
   var paragraph = document.createElement("p");
   paragraph.className = "status";
   if(text == "")
      paragraph.innerHtml = chatTimestamp + username + " went away.";
   else
      paragraph.innerHtml = chatTimestamp + username + " went away: " + text;
   chatLogElement(paragraph);
}

function chatLogElement(element)
{
   //are we currently scrolled to the bottom?
   var isScrolledToEnd = chatLog.scrollTop + chatLog.clientHeight >= chatLog.scrollHeight;

   //add the new element
   chatLog.appendChild(element);

   //if we were at the bottom before, update the scroll position to
   //keep it that way
   if(isScrolledToEnd)
      chatLog.scrollTop = chatLog.scrollHeight - chatLog.clientHeight;
}

var chatInput;

function chatSubmitText(element)
{
   if(element.value == "")
      return;
   chatApplet.submit(element.value);
   element.value = "";

   //Safari loses input focus every time the user hits enter...
   chatInput = element;
   setTimeout("chatInput.focus()", 0);
}

function chatAddUser(id, name, influence, avatar, border, background, isAway, awayMessage)
{
   var fixedName = fixName(name);

   var link = document.createElement("a");
   link.href = chatIocmUrl + "~" + fixedName;
   link.target = "_blank";  //would be annoying to click and leave chat...

   if(border && background)
   {
      link.style.borderColor = border;
      link.style.backgroundColor = background;
   }

   if(avatar)
   {
      var image = document.createElement("img");
      image.className = "avatar";
      image.src = chatAvatarsUrl + avatar + "/" + name;
      image.alt = "";
      link.appendChild(image);
   }

   var div = document.createElement("div");
   div.className = "username";
   div.appendChild(document.createTextNode(name));
   link.appendChild(div);

   if(isAway)
   {
      var message;
      if(awayMessage == "")
         message = "Away";
      else
         message = "Away: " + awayMessage;
      div = document.createElement("div");
      div.className = "away-message";
      if(border)
         div.style.color = border;
      div.appendChild(document.createTextNode(chatShortedAway(message)));
      link.appendChild(div);
      link.title = message;
   }
   else
      link.title = "";

   link.connectionId = id;
   link.userBorderColor = border;
   link.influence = influence;

   //order users in the list by influence
   var children = chatUsers.childNodes;
   var before = null;
   for(var i = 0; i < children.length; i++)
   {
      if(children[i].connectionId == -1 || children[i].influence < influence)
      {
         before = children[i];
         break;
      }
   }

   if(before)
      chatUsers.insertBefore(link, before);
   else
      chatUsers.appendChild(link);
}

function chatRemoveUser(id)
{
   var children = chatUsers.childNodes;

   //find the user in the list
   for(var i = 0; i < children.length; i++)
   {
      if(children[i].connectionId == id)
      {
         chatUsers.removeChild(children[i]);
         break;
      }
   }
}

function chatAddWatcher()
{
   var children = chatUsers.childNodes;

   //find the watcher info in the list...
   for(var i = 0; i < children.length; i++)
   {
      if(children[i].connectionId == -1)
      {
         children[i].watcherCount++;
         if(children[i].watcherCount == 1)
            children[i].innerHTML = "1 watcher"
         else
            children[i].innerHTML = children[i].watcherCount + " watchers"
         return;
      }
   }

   var div = document.createElement("div")
   div.className = "watchers"
   div.connectionId = -1;
   div.watcherCount = 1;
   div.innerHTML = "1 watcher";
   chatUsers.appendChild(div);
}

function chatRemoveWatcher()
{
   var children = chatUsers.childNodes;

   //find the watcher info in the list...
   for(var i = 0; i < children.length; i++)
   {
      if(children[i].connectionId == -1)
      {
         children[i].watcherCount--;
         if(children[i].watcherCount == 0)
            chatUsers.removeChild(children[i]);
         else if(children[i].watcherCount == 1)
            children[i].innerHTML = "1 watcher"
         else
            children[i].innerHTML = children[i].watcherCount + " watchers"
         return;
      }
   }
}

function chatSetAway(id, hasText, awayMessage)
{
   var children = chatUsers.childNodes;

   //find the user in the list
   for(var i = 0; i < children.length; i++)
   {
      if(children[i].connectionId == id)
      {
         var link = children[i];

         parts = link.childNodes;
         for(var j = 0; j < parts.length; j++)
         {
            if(parts[j].className == "away-message")
            {
               link.removeChild(parts[j]);
               break;
            }
         }

         if(hasText)
         {
            var message;
            if(awayMessage == "")
               message = "Away";
            else
               message = "Away: " + awayMessage;
            var div = document.createElement("div");
            div.className = "away-message";
            if(children[i].userBorderColor)
               div.style.color = children[i].userBorderColor;
            div.appendChild(document.createTextNode(chatShortedAway(message)));
            link.appendChild(div);
            link.title = message;
         }
         else
            link.title = "";

         break;
      }
   }
}

function chatShortedAway(message)
{
   /* Without some way of accessing font metrics from Javascript, we
    * have to guess how much text can be displayed...  This seems to
    * work well most of the time. */
   if(message.length <= 24)
      return message;
   else
      return message.substring(0, 23) + "...";
}

function fixName(name)
{
   var result = "";
   for(var i = 0; i < name.length; i++)
   {
      c = name.charAt(i);
      if((c >= 'A' && c <= 'Z')
      || (c >= 'a' && c <= 'z')
      || (c >= '0' && c <= '9'))
         result += c;
   }
   return result.toLowerCase();
}



var chatHeight = 450;
var chatDragStartY = -1;

function chatSizeDragStart(event)
{
   chatDragStartY = event.clientY;
}

function chatSizeDragEnd(event)
{
   if(chatDragStartY == -1)
      return;

   chatSizeDrag(event);
   chatHeight += event.clientY - chatDragStartY;
   chatDragStartY = -1;
}

function chatSizeDrag(event)
{
   if(chatDragStartY == -1)
      return;

   var height = chatHeight + event.clientY - chatDragStartY;

   chatLog.style.height   = (height - 8) + "px";
   chatUsers.style.height = height + "px";
}
