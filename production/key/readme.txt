key store password: tradekings@123

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore tradekings-key.jks app-release-unsigned.apk tradekings


zipalign -v 4 app-release-unsigned.apk tradekings001.apk