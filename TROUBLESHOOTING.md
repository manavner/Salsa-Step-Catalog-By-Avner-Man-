# פתרון בעיות ריצת האפליקציה

## הבעיה שנתקלת בה

אתה מקבל שגיאה: `ERR_CONNECTION_REFUSED` כאשר אתה מנסה לגשת ל-localhost, וכאשר מנסים להריץ את השרת מקבלים:

```
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"
```

## הסיבה לבעיה

הבעיה נגרמת בגלל שגרסת Node.js 22.16.0 החדשה יש בעיות תאימות עם מודולי TypeScript של Expo.

## פתרונות אפשריים

### פתרון 1: שינוי גרסת Node.js (מומלץ)

1. התקן NVM (Node Version Manager):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
```

2. התקן ושימוש בגרסת Node.js 18:
```bash
nvm install 18
nvm use 18
```

3. התקן מחדש את ה-dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

4. הרץ את האפליקציה:
```bash
npm run web
```

### פתרון 2: שימוש ב-Yarn במקום npm

1. התקן Yarn:
```bash
npm install -g yarn
```

2. מחק את npm dependencies:
```bash
rm -rf node_modules package-lock.json
```

3. התקן עם Yarn:
```bash
yarn install
```

4. הרץ עם Yarn:
```bash
yarn web
```

### פתרון 3: שימוש ב-Docker

צור קובץ `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 19006
CMD ["npm", "run", "web"]
```

והרץ:
```bash
docker build -t my-expo-app .
docker run -p 19006:19006 my-expo-app
```

### פתרון 4: עדכון התצורה של Supabase

וודא שקובץ `.env` מכיל:
```
EXPO_PUBLIC_SUPABASE_URL=your_actual_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

אם אין לך פרויקט Supabase, תוכל להשאיר ערכי ברירת מחדל זמנית.

## גישה לאפליקציה

כאשר השרת רץ בהצלחה, תוכל לגשת לאפליקציה דרך:
- דפדפן: `http://localhost:19006`
- Expo Go app: סרוק את ה-QR code שמופיע בטרמינל

## צרו קשר לעזרה נוספת

אם הפתרונות לא עובדים, בדוק:
1. שאין תהליכים אחרים שמשתמשים בפורט 19006
2. שחומת האש לא חוסמת את הפורט
3. נסה להריץ את האפליקציה ללא פלג `--web` ברך על המכשיר הנייד