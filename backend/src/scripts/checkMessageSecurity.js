/**
 * Script to check message security and verify no data leakage
 * Run this to verify that messages are properly associated with users
 * 
 * Usage: node src/scripts/checkMessageSecurity.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Message = require('../app/models/messageModel');
const User = require('../app/models/userModel');

async function checkMessageSecurity() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Get all users
    const users = await User.find().select('_id email username');
    console.log(`\n📊 Found ${users.length} users`);

    // Check messages for each user
    for (const user of users) {
      const messageCount = await Message.countDocuments({ user: user._id });
      console.log(`\n👤 User: ${user.email} (${user.username})`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Messages: ${messageCount}`);

      if (messageCount > 0) {
        // Get sample messages
        const sampleMessages = await Message.find({ user: user._id })
          .limit(3)
          .select('role content createdAt user')
          .sort({ createdAt: -1 });

        console.log(`   Latest messages:`);
        sampleMessages.forEach((msg, idx) => {
          console.log(`   ${idx + 1}. [${msg.role}] ${msg.content.substring(0, 50)}... (${msg.createdAt})`);
          
          // SECURITY CHECK: Verify user field matches
          if (msg.user.toString() !== user._id.toString()) {
            console.error(`   ⚠️ SECURITY ERROR: Message ${msg._id} has wrong user field!`);
            console.error(`      Expected: ${user._id}`);
            console.error(`      Actual: ${msg.user}`);
          }
        });
      }
    }

    // Check for orphaned messages (messages without valid user)
    console.log('\n🔍 Checking for orphaned messages...');
    const allMessages = await Message.find().select('_id user');
    const userIds = users.map(u => u._id.toString());
    
    let orphanedCount = 0;
    for (const msg of allMessages) {
      if (!userIds.includes(msg.user.toString())) {
        orphanedCount++;
        console.error(`⚠️ Orphaned message found: ${msg._id} (user: ${msg.user})`);
      }
    }

    if (orphanedCount === 0) {
      console.log('✅ No orphaned messages found');
    } else {
      console.error(`❌ Found ${orphanedCount} orphaned messages`);
    }

    // Summary
    console.log('\n📈 Summary:');
    console.log(`   Total users: ${users.length}`);
    console.log(`   Total messages: ${allMessages.length}`);
    console.log(`   Orphaned messages: ${orphanedCount}`);
    
    if (orphanedCount === 0) {
      console.log('\n✅ All messages are properly associated with users');
    } else {
      console.log('\n❌ Security issues detected!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the check
checkMessageSecurity();
